// ProfileCircle.js
import React, { useState } from 'react';
import './ProfileCircle.css';
import ProfileNav from './ProfileNav.jsx';
import menuClick from '../../assets/audio/menu-btn-hover.mp3';
import menuBtn from '../../assets/audio/menu-button.mp3';
import openMenu from '../../assets/audio/menu-open.mp3';
import { useKeyPress } from '../../hooks/useKeyPress';
import KeyPressHandler from '../KeyPressHandler';

const ProfileCircle = ({ profileImage, lifeBarColor, showProfileNav, setShowProfileNav }) => {
  const menuClickSfx = () => {
    const audio = new Audio(menuBtn);
    audio.play();
  };
  const openMenuSfx = () => {
    const audio = new Audio(openMenu);
    audio.play();
  };


  const handleProfileCircleClick = () => {
    // console.log(setShowProfileNav);
    menuClickSfx();

    if (!showProfileNav) {
      setTimeout(() => {
        openMenuSfx();
      }, 100);
    }
    setShowProfileNav(!showProfileNav);
    // console.log("showProfileNav: ", showProfileNav);
  };

  return (
    <div className="profile-circle-container">
      <KeyPressHandler pressedKey="P" callBack={handleProfileCircleClick} />
      {/* <ProfileNav /> */}
      <div
        className="profile-circle"
        onClick={handleProfileCircleClick}
        style={{
          backgroundImage: `url(${profileImage})`,
          border: `8px solid ${lifeBarColor}`,
        }}
      >
        <div className="life-bar" style={{ backgroundColor: lifeBarColor }} />
      </div>
      {/* {showProfileNav && <ProfileNav />} */}
    </div>
  );
};

export default ProfileCircle;