import React from 'react';
import './Landingpage.css';
import ConnectWallet from '../web3/ConnectWallet';

const LandingPage = ({ children }) => {
  return (
    <div className='lp-container'>
      {children}
    </div>
  );
};


export default LandingPage;
