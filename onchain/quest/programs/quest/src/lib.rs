use anchor_lang::prelude::*;
// use anchor_lang::system_program::{self, Transfer}; // Correctly import Transfer from system_program

declare_id!("EFQyxLxzJb6povm4e3wmxok31qzYsxrGZsj6ArRWCGRL");

#[program]
pub mod quest {
    use super::*;

    pub fn create_quest(
        ctx: Context<CreateQuest>,
        quest_id: String,
        prize: u64,
        winners: Vec<WinnerInfo>,
    ) -> Result<()> {
        let quest_account = &mut ctx.accounts.quest_account;
        quest_account.host = *ctx.accounts.host.key;
        quest_account.prize = prize;
        quest_account.winners = winners;
        quest_account.quest_id = quest_id;
        quest_account.is_prize_distributed = false;
        Ok(())
    }

    pub fn deposit_prize(ctx: Context<DepositPrize>, amount: u64) -> Result<()> {
        let quest_account = &mut ctx.accounts.quest_account;
        require!(quest_account.prize == amount, CustomError::IncorrectPrizeAmount);

        let cpi_accounts = Transfer {
            from: ctx.accounts.host.to_account_info(),
            to: ctx.accounts.escrow_account.to_account_info(),
        };

        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        system_program::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn distribute_prize(ctx: Context<DistributePrize>) -> Result<()> {
        let quest_account = &mut ctx.accounts.quest_account;
        require!(!quest_account.is_prize_distributed, CustomError::PrizeAlreadyDistributed);

        let total_prize = quest_account.prize;

        for winner in quest_account.winners.iter() {
            let amount = (total_prize as u128 * winner.percentage as u128 / 100) as u64;

            **ctx.accounts.escrow_account.to_account_info().try_borrow_mut_lamports()? -= amount;
            **ctx.accounts
                .winner_accounts
                .get(winner.index as usize)
                .unwrap()
                .to_account_info()
                .try_borrow_mut_lamports()? += amount;
        }

        quest_account.is_prize_distributed = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateQuest<'info> {
    #[account(init, payer = host, space = 8 + QuestAccount::LEN)]
    pub quest_account: Account<'info, QuestAccount>,
    #[account(mut)]
    pub host: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositPrize<'info> {
    #[account(mut, has_one = host)]
    pub quest_account: Account<'info, QuestAccount>,
    #[account(mut)]
    pub host: Signer<'info>,
    #[account(mut)]
    pub escrow_account: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DistributePrize<'info> {
    #[account(mut, has_one = host)]
    pub quest_account: Account<'info, QuestAccount>,
    #[account(mut)]
    pub host: Signer<'info>,
    #[account(mut)]
    pub escrow_account: SystemAccount<'info>,
    #[account(mut)]
    pub winner_accounts: Vec<AccountInfo<'info>>, // Ensure this is a vector of AccountInfo
    pub system_program: Program<'info, System>,
}

#[account]
pub struct QuestAccount {
    pub host: Pubkey,
    pub quest_id: String,
    pub prize: u64,
    pub winners: Vec<WinnerInfo>,
    pub is_prize_distributed: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct WinnerInfo {
    pub index: u8,
    pub percentage: u8,
}

impl QuestAccount {
    pub const LEN: usize = 32 + 32 + 8 + (4 + 32 * 4 + 1 + 1) + 1;
}

#[error_code]
pub enum CustomError {
    #[msg("Incorrect prize amount.")]
    IncorrectPrizeAmount,
    #[msg("Prize already distributed.")]
    PrizeAlreadyDistributed,
}
