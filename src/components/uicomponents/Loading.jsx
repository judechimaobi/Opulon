import React from 'react';
import './Loading.css';

const Loading = ({ progress }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <h2>Loading... {progress}%</h2>
        {/* You can add a spinner or other loading animation here */}
      </div>
    </div>
  );
};

export default Loading;
