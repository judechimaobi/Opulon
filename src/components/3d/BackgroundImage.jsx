import React from 'react';
import './BackgroundImage.css';  // CSS file for styling
import background from '../../assets/images/sky.jpg';

const BackgroundImage = ({ children }) => {
  return (
    <div
      className="background-image"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh',  // Full screen height
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundImage;
