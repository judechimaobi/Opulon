import React, { useEffect } from 'react';

function KeyPressHandler({ pressedKey, callBack }) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        event.key.toUpperCase() === pressedKey.toUpperCase()
      ) {
        callBack();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [pressedKey, callBack]);

  return
}

export default KeyPressHandler;
