use anchor_lang::prelude::*;

declare_id!("5MgH76ZAy2eaVGgWczHTpiVoKdMRPtDF5XRmNYzdhhDh");

#[program]
pub mod crud {
    use super::*;

    pub fn create_user_account(
        ctx: Context<CreateUserAccount>,
        username: String,
        gaming_tag: String,
    ) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        user_account.owner = ctx.accounts.owner.key();
        user_account.username = username;
        user_account.gaming_tag = gaming_tag;

        user_account.entry_id = 0; // Initialize entry_id
        
        Ok(())
    }
    
    pub fn update_user_account(
        ctx: Context<UpdateUserAccount>,
        _username: String,
        new_gaming_tag: String,
    ) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        user_account.gaming_tag = new_gaming_tag;

        Ok(())
    }


    pub fn delete_user_account(
        _ctx: Context<DeleteUserAccount>,
        _username: String,
    ) -> Result<()> {
        Ok(())
    }
}




#[account]
#[derive(InitSpace)]

pub struct UserAccountState {
    pub owner: Pubkey,
    #[max_len(20)]
    pub username: String,
    #[max_len(200)]
    pub gaming_tag: String,
    pub entry_id: u64,
}

#[derive(Accounts)]
#[instruction(username: String)]

pub struct CreateUserAccount<'info> {
    #[account{
        init,
        seeds = [username.as_bytes(), owner.key().as_ref()],
        bump,
        payer = owner,
        space = 8 + UserAccountState::INIT_SPACE,
    }]

    pub user_account: Account<'info, UserAccountState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}



#[derive(Accounts)]
#[instruction(username: String)]

pub struct UpdateUserAccount<'info> {
    #[account{
        mut,
        seeds = [username.as_bytes(), owner.key().as_ref()],
        bump,
        realloc = 8 + UserAccountState::INIT_SPACE,
        realloc::payer = owner,
        realloc::zero = true,
    }]

    pub user_account: Account<'info, UserAccountState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}



#[derive(Accounts)]
#[instruction(username: String)]

pub struct DeleteUserAccount<'info> {
    #[account{
        mut,
        seeds = [username.as_bytes(), owner.key().as_ref()],
        bump,
        close = owner,
    }]

    pub user_account: Account<'info, UserAccountState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
