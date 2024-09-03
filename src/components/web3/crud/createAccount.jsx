// CreateAccount.jsx
import React, { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { program, provider, PROGRAM_ID } from './utils'; // Import the program, provider, and PROGRAM_ID

const CreateAccount = () => {
  const [username, setUsername] = useState('');
  const [gamingTag, setGamingTag] = useState('');

  const createUserAccount = async () => {
    try {
      const [userAccountPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(username), provider.wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      await program.methods
        .createUserAccount(username, gamingTag)
        .accounts({
          userAccount: userAccountPda,
          owner: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();

      console.log('User account created successfully');
    } catch (err) {
      console.error('Error creating user account:', err);
    }
  };

  return (
    <div>
      <h2>Create User Account</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Gaming Tag"
        value={gamingTag}
        onChange={(e) => setGamingTag(e.target.value)}
      />
      <button onClick={createUserAccount}>Create Account</button>
    </div>
  );
};

export default CreateAccount;
