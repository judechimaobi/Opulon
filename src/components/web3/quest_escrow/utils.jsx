// utils.jsx
import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

// Initialize the program and provider
const initializeProgram = (network, programId) => {
  const connection = new Connection(network);
  const wallet = useWallet();
  const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
  const idl = '../../../../onchain/quest_escrow/target/idl/quest_escrow.json'; // Add your IDL here
  const program = new anchor.Program(idl, programId, provider);
  return { program, provider };
};

// Create a quest
export const createQuest = async (programId, network, questId, prize, winners) => {
  const { program, provider } = initializeProgram(network, programId);
  try {
    const questAccount = anchor.web3.Keypair.generate();
    const tx = await program.rpc.createQuest(
      questId,
      new anchor.BN(prize),
      winners,
      {
        accounts: {
          questAccount: questAccount.publicKey,
          host: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [questAccount],
      }
    );
    return tx;
  } catch (error) {
    throw new Error(`Error creating quest: ${error.message}`);
  }
};

// Deposit a prize
export const depositPrize = async (programId, network, questAccount, amount) => {
  const { program, provider } = initializeProgram(network, programId);
  try {
    const tx = await program.rpc.depositPrize(
      new anchor.BN(amount),
      {
        accounts: {
          questAccount: new PublicKey(questAccount),
          host: provider.wallet.publicKey,
          escrowAccount: provider.wallet.publicKey, // Adjust if different
          systemProgram: anchor.web3.SystemProgram.programId,
        },
      }
    );
    return tx;
  } catch (error) {
    throw new Error(`Error depositing prize: ${error.message}`);
  }
};

// Distribute prize
export const distributePrize = async (programId, network, questAccount, winnerAccounts) => {
  const { program, provider } = initializeProgram(network, programId);
  try {
    const tx = await program.rpc.distributePrize({
      accounts: {
        questAccount: new PublicKey(questAccount),
        host: provider.wallet.publicKey,
        escrowAccount: provider.wallet.publicKey, // Adjust if different
        winnerAccounts: winnerAccounts.map(addr => new PublicKey(addr)),
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });
    return tx;
  } catch (error) {
    throw new Error(`Error distributing prize: ${error.message}`);
  }
};
