import React, { useRef, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// import {
//   PhantomWalletAdapter,
//   SolflareWalletAdapter,
// } from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

import ConnectWalletClaude from './components/web3/ConnectWalletClaude';

import './assets/fonts/fonts.css';
import bifrostSoundSfx from './assets/audio/bifrost-sound.mp3';

import LandingPage from './components/uicomponents/LandingPage';
import ProfileCircle from './components/uicomponents/ProfileCircle.jsx';
import ProfileNav from './components/uicomponents/ProfileNav.jsx';
import Experience from './components/3d/Experience.js';

import { SocketProvider } from './components/uicomponents/SocketProvider';
import BackgroundImage from './components/3d/BackgroundImage.jsx';
import ReclaimVerification from './components/web3/ReclaimVerification.jsx';
import FullScreenVideo from './components/uicomponents/FullScreenVideo.jsx';
import DesktopOnly from './components/uicomponents/DesktopOnly.jsx';
import Loading from './components/uicomponents/Loading.jsx';

const socket = io();

function App() {
  const [connectionState, setConnectionState] = useState('disconnected'); // 'disconnected', 'connected', verified, 'video', 

  const [showProfileNav, setShowProfileNav] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const network = WalletAdapterNetwork.Devnet; // or WalletAdapterNetwork.Mainnet
  const endpoint = clusterApiUrl(network);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize wallet adapters
  const wallets = [
    // new SolflareWalletAdapter(),
    // new PhantomWalletAdapter()
  ];

  const handleConnect = useCallback((pubKey) => {
    sessionStorage.setItem('pubKey', pubKey);
    setConnectionState('connected');
  }, []);

  const handleOnVerified = useCallback(() => {
    setConnectionState('video');
  }, []);

  const handleVideoEnd = useCallback(() => {
    setConnectionState('verified');
  }, []);

  
  const handleDisconnect = useCallback(() => {
    setConnectionState('disconnected');
  }, []);


  // Loading Logic
  useEffect(() => {
    const loadData = async () => {
      const totalResources = 15;
      for (let i = 0; i <= totalResources; i++) {
        // Simulate loading a resource
        await new Promise((resolve) => {
          const randomTime = Math.random() * 1000 + 500;
          setTimeout(() => {
            setLoadingProgress(Math.round((i / totalResources) * 100));
            resolve();
          }, randomTime);
        });
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <Loading progress={loadingProgress} />;
  }

  

  return (
    <DesktopOnly>
      <WalletProvider wallets={wallets} autoConnect endpoint={endpoint}>
        <WalletModalProvider>
        <BackgroundImage>
          
          <SocketProvider>
            <Experience connectionState={connectionState} />
            {showProfileNav && <ProfileNav />}
            
            {connectionState === 'video' && (<FullScreenVideo onEnd={handleVideoEnd} />)}
            {connectionState === 'verified' && (<ProfileCircle profileImage={"logo.png"} lifeBarColor={"#377dff"} showProfileNav={showProfileNav} setShowProfileNav={setShowProfileNav} />)}
          </SocketProvider>

          {connectionState === 'disconnected' && (
            <LandingPage>
              <h2 className='lp-title'>Welcome to the <span className='animated-gradient-text'>Opulon</span></h2>
              <ConnectWalletClaude onConnect={handleConnect} onDisconnect={handleDisconnect} />
            </LandingPage>
          )}
          {connectionState === 'connected' && (
            <LandingPage>
              <ReclaimVerification onVerified={handleOnVerified} />
            </LandingPage>
            )}
          
        </BackgroundImage>
        </WalletModalProvider>
      </WalletProvider>
    </DesktopOnly>    
  );
}


export default App;
