import React, { useState } from 'react';
import { distributePrize } from './utils';

const DistributePrize = ({ programId, network }) => {
  const [questAccount, setQuestAccount] = useState('');
  const [winnerAccounts, setWinnerAccounts] = useState(['']);

  const handleDistributePrize = async () => {
    try {
      const tx = await distributePrize(programId, network, questAccount, winnerAccounts);
      console.log('Prize distributed successfully:', tx);
    } catch (error) {
      console.error(error.message);
    }
  };

  const addWinnerAccount = () => {
    setWinnerAccounts([...winnerAccounts, '']);
  };

  const handleWinnerAccountChange = (index, value) => {
    const accounts = [...winnerAccounts];
    accounts[index] = value;
    setWinnerAccounts(accounts);
  };

  return (
    <div>
      <h2>Distribute Prize</h2>
      <input
        type="text"
        placeholder="Quest Account"
        value={questAccount}
        onChange={(e) => setQuestAccount(e.target.value)}
      />
      {winnerAccounts.map((account, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Winner Account ${index + 1}`}
          value={account}
          onChange={(e) => handleWinnerAccountChange(index, e.target.value)}
        />
      ))}
      <button onClick={addWinnerAccount}>Add Winner Account</button>
      <button onClick={handleDistributePrize}>Distribute Prize</button>
    </div>
  );
};

export default DistributePrize;
