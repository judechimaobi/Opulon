import React, { useState } from 'react';
import { depositPrize } from './utils';

const DepositPrize = ({ programId, network }) => {
  const [questAccount, setQuestAccount] = useState('');
  const [amount, setAmount] = useState(0);

  const handleDepositPrize = async () => {
    try {
      const tx = await depositPrize(programId, network, questAccount, amount);
      console.log('Prize deposited successfully:', tx);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h2>Deposit Prize</h2>
      <input
        type="text"
        placeholder="Quest Account"
        value={questAccount}
        onChange={(e) => setQuestAccount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button onClick={handleDepositPrize}>Deposit Prize</button>
    </div>
  );
};

export default DepositPrize;
