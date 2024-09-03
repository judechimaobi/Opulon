// UpdateOrDeleteAccount.jsx
import React, { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { program, provider, PROGRAM_ID } from './utils'; // Import the program, provider, and PROGRAM_ID

const UpdateOrDeleteAccount = () => {
  const [username, setUsername] = useState('');
  const [newGamingTag, setNewGamingTag] = useState('');

  const updateUserAccount = async () => {
    try {
      const [userAccountPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(username), provider.wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      await program.methods
        .updateUserAccount(username, newGamingTag)
        .accounts({
          userAccount: userAccountPda,
          owner: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();

      console.log('User account updated successfully');
    } catch (err) {
      console.error('Error updating user account:', err);
    }
  };

  const deleteUserAccount = async () => {
    try {
      const [userAccountPda, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(username), provider.wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );

      await program.methods
        .deleteUserAccount(username)
        .accounts({
          userAccount: userAccountPda,
          owner: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();

      console.log('User account deleted successfully');
    } catch (err) {
      console.error('Error deleting user account:', err);
    }
  };

  return (
    <div>
      <h2>Update User Account</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="New Gaming Tag"
        value={newGamingTag}
        onChange={(e) => setNewGamingTag(e.target.value)}
      />
      <button onClick={updateUserAccount}>Update Account</button>

      <h2>Delete User Account</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={deleteUserAccount}>Delete Account</button>
    </div>
  );
};

export default UpdateOrDeleteAccount;
