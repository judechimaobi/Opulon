import React, { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import './ConnectWallet.css';

const ConnectWallet = () => {
  // const { select, connect, connected, disconnect, wallets } = useWallet();

  // const connectWallet = useCallback(async () => {
  //   // console.log("Select: " + select, "Connect: " + connect, "Connected: " + connected, "Disconnected: " + disconnect,"Wallet: " +  wallets);
  //   if (!connected && wallets) {
  //     try {
  //       select(wallets[0].adapter.name);
  //       await connect();
  //     } catch (error) {
  //       console.error('Failed to connect wallet:', error);
  //       alert('Failed to connect wallet. Please try again.');
  //     }
  //   }
  // }, [connect, select, connected, wallets]);


  // const connectWallet = async () => {
	// 	if (wallets.length > 0 && !connected) {
	// 		try {
	// 			select(wallets[0].adapter.name);
	// 			await connect();
	// 		} catch (error) {
	// 			console.error('Failed to connect wallet:', error);
	// 			// alert('Failed to connect wallet. Please try again.');
	// 		}
	// 	}
	// };

  const { select, connect, connected, wallets, disconnect } = useWallet();
	const connectWallet = useCallback(async () => {
    console.log("Select: " + select, "Connect: " + connect, "Connected: " + connected, "Disconnected: " + disconnect,"Wallet: " +  wallets);
		if (wallets.length > 0 && !connected) {
			try {
				select(wallets[0].adapter.name);
				await connect();
			} catch (error) {
				console.error('Failed to connect wallet:', error);
				// alert('Failed to connect wallet. Please try again.');
			}
		}
	});


  // const connectWallet = useCallback(async (walletIndex) => {
  //   if (wallets.length > 0 && !connected) {
  //     try {
  //       select(wallets[walletIndex].adapter.name);
  //       await connect();
  //     } catch (error) {
  //       console.error('Failed to connect wallet:', error);
  //       // alert('Failed to connect wallet. Please try again.');
  //     }
  //   }
  // }, [select, connect, connected, wallets]);


  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      alert('Failed to disconnect wallet. Please try again.');
    }
  }, [disconnect]);

  // Get the public key if connected
  const publicKey = wallets[0]?.adapter?.publicKey?.toString();

  return (
    <div>
      {!connected ? (
        <div className='connect-btn-box'>
          <button onClick={connectWallet} className='connect-wallet-btn'>Enter the Elysium</button>
        </div>
      ) : (
        <div className='connect-btn-box'>
          <button onClick={disconnectWallet} className='connect-wallet-btn'>Exit</button>
          <p>Wallet Connected: {publicKey}</p>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
