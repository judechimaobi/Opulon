// ProfileNav.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChest, faQuest, faAvatar, faChat } from '@fortawesome/free-solid-svg-icons';
import './ProfileNav.css';
import menuHover from '../../assets/audio/menu-btn-hover.mp3';
import menuClick2 from '../../assets/audio/menu-click-2.mp3';

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

const ProfileNav = () => {
  const menuHoverSfx = () => {
    const audio = new Audio(menuHover);
    audio.play();
  };

  const menuClickSfx = () => {
    const audio = new Audio(menuClick2);
    audio.play();
  };

  const handleMenuClick = () => {
    menuClickSfx();
  }
  return (
    <div className='container'>
      <div className='overlay'>

        <div className="profile-nav-container">
          <div className="profile-nav-items-container">

            <div className='profile-nav-item-box slide-in-left'>
              <div className="profile-nav-item slide-in-left" onMouseEnter={menuHoverSfx} onClick={handleMenuClick}>
                <span>Chest</span>
              </div>
            </div>


            <div className='profile-nav-item-box slide-in-left'>
              <div className="profile-nav-item slide-in-left-delay1" onMouseEnter={menuHoverSfx} onClick={handleMenuClick}>
                <span>Quest</span>
              </div>
            </div>

            <div className='profile-nav-item-box slide-in-left'>
              <div className="profile-nav-item slide-in-left-delay2" onMouseEnter={menuHoverSfx} onClick={handleMenuClick}>
                <span>Avatar</span>
              </div>
            </div>
            
            <div className='profile-nav-item-box slide-in-left'>
              <div className="profile-nav-item slide-in-left-delay3" onMouseEnter={menuHoverSfx} onClick={handleMenuClick}>
                <span>Chat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProfileNav;