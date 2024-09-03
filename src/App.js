import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// import {
//   PhantomWalletAdapter,
//   SolflareWalletAdapter,
// } from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';

// Import the styles
import '@solana/wallet-adapter-react-ui/styles.css';

import ConnectWalletClaude from './components/web3/ConnectWalletClaude';

import './assets/fonts/fonts.css';
import transition from './assets/videos/transition1.mp4';
import transitionSfx from './assets/audio/transition.mp3';
import bifrostSoundSfx from './assets/audio/bifrost-sound.mp3';

import LandingPage from './components/uicomponents/LandingPage';
import ProfileCircle from './components/uicomponents/ProfileCircle.jsx';
import ProfileNav from './components/uicomponents/ProfileNav.jsx';
import { Physics, RigidBody } from '@react-three/rapier';
import Experience from './components/3d/Experience.js';
import VideoChat from './components/uicomponents/VideoChat.jsx';

const socket = io();

function App() {
  // const [walletConnected, setWalletConnected] = useState(false);
  // const [showBifrost, setShowBifrost] = useState(true);
  // const [showVideo, setShowVideo] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected'); // 'disconnected', 'video', 'connected'

  const [showProfileNav, setShowProfileNav] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

  // You can also provide a custom RPC endpoint
  const network = WalletAdapterNetwork.Devnet; // or WalletAdapterNetwork.Mainnet
  const endpoint = clusterApiUrl(network);

  // Initialize wallet adapters
  const wallets = [
    // new PhantomWalletAdapter(),
    // new SolflareWalletAdapter(),
  ];




  const entranceSfx = () => {
    const audio = new Audio(transitionSfx);
    audio.play();
  };

  const bifrostSound = () => {
    const audio = new Audio(bifrostSoundSfx);
    audio.volume = 0.4;
    audio.loop = true;
    audio.play();
  };


  const FullScreenVideo = ({ onEnd }) => {
    entranceSfx();
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        backgroundColor: 'black'
      }}>
        <video
          src={require('./assets/videos/transition.mp4')}
          autoPlay={true}
          muted={true}
          preload="auto"
          onEnded={onEnd}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
    );
  };


  const handleConnect = useCallback((pubKey) => {
    sessionStorage.setItem('pubKey', pubKey);
    setConnectionState('video');
  }, []);

  const handleDisconnect = useCallback(() => {
    setConnectionState('disconnected');
  }, []);

  const handleVideoEnd = useCallback(() => {
    setConnectionState('connected');
  }, []);

  return (
    <WalletProvider wallets={wallets} autoConnect endpoint={endpoint}>
      <WalletModalProvider>
        <Experience connectionState={connectionState} />
        {showProfileNav && <ProfileNav />}
        {connectionState === 'video' && (<FullScreenVideo onEnd={handleVideoEnd} />)}
        {connectionState === 'connected' && (<ProfileCircle profileImage={"logo.png"} lifeBarColor={"#377dff"} showProfileNav={showProfileNav} setShowProfileNav={setShowProfileNav} />)}
        {connectionState === 'disconnected' && (
          <LandingPage>
            <ConnectWalletClaude onConnect={handleConnect} onDisconnect={handleDisconnect} />
            {/* {bifrostSound()} */}
            {/* {walletConnected && (<p>Connected with public key: {publicKey}</p>)} */}
          </LandingPage>
        )}
        {/* <VideoChat /> */}
      </WalletModalProvider>
    </WalletProvider>
  );
}


export default App;
