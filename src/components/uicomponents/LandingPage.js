import React from 'react';
import './Landingpage.css';
import ConnectWallet from '../web3/ConnectWallet';

const LandingPage = ({setConnected, connected}) => {
	// console.log(setConnected);
  return (
    <div className='container'>
			<h2 className='title'>Welcome to the<span>Opulon</span></h2>
			<ConnectWallet />
    </div>
  );
};

export default LandingPage;
