import { useEffect } from 'react';

function useKeyPress(pressedKey, callBack) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toUpperCase() === pressedKey.toUpperCase()) {
        callBack();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [pressedKey, callBack]);
}

export default useKeyPress;
