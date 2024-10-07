import React, { useState, useEffect } from 'react';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import QRCode from 'react-qr-code';
import './ReclaimVerification.css';

function ReclaimVerification({ onVerified }) {
  const [requestUrl, setRequestUrl] = useState('');
  const [proofs, setProofs] = useState(null);
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    async function initializeReclaim() {
      const APP_ID = '0x8c75194E109871b359C443fB64035d26de9A9367';
      const APP_SECRET = '0x7d98d411aa62119b236e3f6a922566c384de93a1df27561289384bad3eb1f4e8';
      const PROVIDER_ID = 'f9f383fd-32d9-4c54-942f-5e9fda349762';

      try {
        const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
        const url = await reclaimProofRequest.getRequestUrl();
        setRequestUrl(url);
        setLoading(false); // Stop loading when URL is set

        await reclaimProofRequest.startSession({
          onSuccess: (proofs) => {
            console.log('Verification success', proofs);
            setProofs(proofs);
            onVerified();
          },
          onError: (error) => {
            console.error('Verification failed', error);
          },
        });
      } catch (error) {
        console.error('Error initializing Reclaim', error);
        setLoading(false); // Stop loading if there's an error
      }
    }

    initializeReclaim();
  }, [onVerified]);

  const handleSkip = () => {
    onVerified();
  };

  return (
    <div>
      {loading ? (
        <div className="loader">
          <p>initiating verification...</p>
        </div>
      ) : (
        requestUrl && (
          <div className='qr-code-box'>
            <h2 className='qr-title'>Scan this QR code to start the verification process</h2>
            <QRCode value={requestUrl} className='qr-code' />
            <div className='btnBox'>
              <button className='verifyBtn' onClick={() => window.open(requestUrl)}>Start Verification</button>
              <button className='verifyBtn verifyBtnOutline' onClick={handleSkip}>Skip</button>
            </div>
          </div>
        )
      )}
      {proofs && (
        <div>
          <h2>Verification Successful!</h2>
          <pre>{JSON.stringify(proofs, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ReclaimVerification;
