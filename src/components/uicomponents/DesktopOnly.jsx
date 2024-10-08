import React, { useEffect, useState } from 'react';
import PopUp from './PopUp';

const DesktopOnly = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setIsDesktop(false);
      } else {
        setIsDesktop(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isDesktop) {
    return (
      <PopUp visible={!isDesktop}>
        <p>Your device is not supported. Please use a <span>desktop</span> to gain access to Opulon.</p>
        {/* <p>Mobile version is coming soon.</p> */}
        <h2>Mobile version is coming soon.</h2>
        <button className="popup-close-btn" onClick={() => window.location.href = "https://opulon.world"}>
          Back to landing page
        </button>

      </PopUp>
    );
  }

  return <>{children}</>;
};

export default DesktopOnly;
