import React, { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

// Make sure to import the CSS somewhere in your app
// import '@solana/wallet-adapter-react-ui/styles.css';

const ConnectWallet = ({ onConnect, onDisconnect }) => {
  const { wallet, connect, disconnect, connected, publicKey } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = useCallback(async () => {
    if (wallet) {
      try {
        setIsConnecting(true);
        await connect();
      } catch (error) {
        console.error('Failed to connect:', error);
        if (error instanceof WalletNotConnectedError) {
          console.error('Wallet not connected');
        }
      } finally {
        setIsConnecting(false);
      }
    } else {
      console.error('No wallet detected. Please install a Solana wallet extension.');
    }
  }, [wallet, connect]);

  const handleDisconnect = useCallback(async () => {
    if (connected) {
      try {
        await disconnect();
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
  }, [connected, disconnect]);

  useEffect(() => {
    if (connected && publicKey) {
      // console.log('Wallet connected. Public key:', publicKey.toBase58());
      onConnect(publicKey.toBase58());
    } else {
      // console.log('Wallet disconnected');
      onDisconnect();
    }
  }, [connected, publicKey, onConnect, onDisconnect]);

  return (
    <WalletMultiButton
      onClick={connected ? handleDisconnect : handleConnect}
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : connected ? 'Disconnect' : 'Connect Wallet to Enter the Opulon'}
    </WalletMultiButton>
  );
};

export default ConnectWallet;