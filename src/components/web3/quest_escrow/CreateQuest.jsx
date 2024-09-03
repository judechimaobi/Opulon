import React, { useState } from 'react';
import { createQuest } from './utils';

const CreateQuest = ({ programId, network }) => {
  const [questId, setQuestId] = useState('');
  const [prize, setPrize] = useState(0);
  const [winners, setWinners] = useState([{ index: 0, percentage: 100 }]);

  const handleCreateQuest = async () => {
    try {
      const tx = await createQuest(programId, network, questId, prize, winners);
      console.log('Quest created successfully:', tx);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h2>Create Quest</h2>
      <input
        type="text"
        placeholder="Quest ID"
        value={questId}
        onChange={(e) => setQuestId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Prize Amount"
        value={prize}
        onChange={(e) => setPrize(Number(e.target.value))}
      />
      <button onClick={handleCreateQuest}>Create Quest</button>
    </div>
  );
};

export default CreateQuest;
