import React, { useMemo, useCallback, useEffect } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

import '../App.css';
import '@solana/wallet-adapter-react-ui/styles.css';

const Context = ({ children, setConnected, connected }) => {
  console.log(connected);
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network]);

  const onWalletConnect = useCallback(() => {
    setConnected(true);
  }, [setConnected]);

  // useEffect(() => {
  //   onWalletConnect();
  // }, [onWalletConnect])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content = () => {
  return (
    <div className="wallet">
      <WalletMultiButton />
    </div>
  );
};

export { Context, Content };
