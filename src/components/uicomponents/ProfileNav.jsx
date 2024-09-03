// ProfileNav.js
import React, { useState } from 'react';

import '../../assets/fonts/fonts.css';
import './ProfileNav.css';
import menuHover from '../../assets/audio/menu-btn-hover.mp3';
import menuClick2 from '../../assets/audio/menu-click-2.mp3';


// import '@fortawesome/fontawesome-svg-core/styles.css';
// import { config } from '@fortawesome/fontawesome-svg-core';
import Chest from './Chest';
import AvatarCreator from './AvatarCreator';
import Quest from './Quest';
import Chat from './Chat';





const mainMenu = [
  {name: "chest"},
  {name: "quest"},
  {name: "avatar"},
  {name: "chat"},
];





const ProfileNav = () => {
  const [selectedMenu, setSelectedMenu] = useState('chest');
  const [activeMenuItem, setActiveMenuItem] = useState(0);



  const menuHoverSfx = () => {
    const audio = new Audio(menuHover);
    audio.play();
  };

  const menuClickSfx = () => {
    const audio = new Audio(menuClick2);
    audio.play();
  };

  const handleMenuClick = (menu, index) => {
    menuClickSfx();
    setActiveMenuItem(index);
    setSelectedMenu(menu.name);
  };
  return (
    <div>
      <div className='overlay'>

        <div className="profile-nav-container">
          <div className="profile-nav-items-container">
            {mainMenu.map((menu, index) => (
              <div key={index} className="profile-nav-item-box slide-in-left">
                <div className={`profile-nav-item slide-in-left-delay-${index} ${activeMenuItem === index ? 'active' : ''}`} onMouseEnter={menuHoverSfx} onClick={() => handleMenuClick(menu, index)}>
                  <span>{menu.name}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className='nav-body-container'>
          {selectedMenu === "avatar" && <AvatarCreator />}
          {selectedMenu === "quest" && <Quest />}
          {selectedMenu === "chest" && <Chest /> }
          {selectedMenu === "chat" && <Chat /> }
          {/* {activeMenuItem === "chat" && <AvatarCreator />} */}
        </div>
      </div>
    </div> 

  );
};

export default ProfileNav;