// utils.js
import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

// Replace with your Solana cluster URL
// const SOLANA_CLUSTER_URL = "https://api.devnet.solana.com";
const SOLANA_CLUSTER_URL = "http://localhost:8899";

// Replace with your program ID
export const PROGRAM_ID = new PublicKey('5MgH76ZAy2eaVGgWczHTpiVoKdMRPtDF5XRmNYzdhhDh');

// Create a connection to the cluster
const connection = new Connection(SOLANA_CLUSTER_URL);

// Create a provider with the connection and wallet
export const provider = new anchor.AnchorProvider(connection, window.solana, {
  preflightCommitment: 'processed',
});
anchor.setProvider(provider);

// Load the IDL for your program
const idl = '../../../../onchain/crud/target/idl/crud.json';
export const program = new anchor.Program(idl, PROGRAM_ID, provider);
