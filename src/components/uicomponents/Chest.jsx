import React, { useState } from 'react';
import './Chest.css';
import playerAvatar from '../../assets/images/me-crop.png';
import opCoin from '../../assets/images/op-coin.png';
import menuHover from '../../assets/audio/inner-menu-hover.mp3';
import menuClick from '../../assets/audio/inner-menu-click.mp3';
import btnClick from '../../assets/audio/btn-click.mp3';

import AvatarProfile from '../avatars/AvatarProfile';


const menuHoverSfx = () => {
	const audio = new Audio(menuHover);
	audio.play();
};

const menuClickSfx = () => {
	const audio = new Audio(menuClick);
	audio.play();
};

const btnClickSfx = () => {
	const audio = new Audio(btnClick);
	audio.play();
};






const Chest = () => {
	const [selectedchest, setSelectedchest] = useState(null);
	const [activeTab, setActiveTab] = useState(null);
	
  const handlechestClick = (chest, index) => {
		menuClickSfx();
		setActiveTab(index);
    setSelectedchest(chest);
  };
  const handleStartchestClick = () => {
		btnClickSfx();
  };



  return (
    <div className="chestContainer">
			{/* <h3 className="pageTitle">Chest</h3> */}
			<div className='chestBoard'>
				<div className='avatarImgContainer'
					// style={{
					// 	backgroundImage: `url(${playerAvatar})`,
					// }}
				>
					{/* <img src={playerAvatar} alt="Avatar image" className='playerAvatar' /> */}
					<AvatarProfile />
				</div>
				<div className='playerDetails'>
					<h5 className="gameTag">Legolas</h5>
					<ul>
						{/* <li>Gaming tag
							<span>Username</span>
						</li> */}
						<li>
							{
							sessionStorage.getItem('pubKey') 
							? `${sessionStorage.getItem('pubKey').slice(0, 5)}....${sessionStorage.getItem('pubKey').slice(-5)}`
							: ''
							}


						</li>
					</ul>
				</div>
			</div>

			<div className="chestInnerContainer">
				<div className="col-1">
					<div className='colItem mainItem'>
						<img src={opCoin} alt="OPCoin image" className='opCoin' />
						<p className="mainItemTitle">1824 OPCoin</p>
					</div>
					{/* <div className='colItem'>
						<h5 className="chestTitle">1824 OPCoin</h5>
					</div> */}
        </div>

				<div className='col-2'>
					<div className='colItem'>
						<h5 className="chestTitle">xp: 54</h5>
					</div>
				</div>
				
			</div>
		</div>

  );
};

export default Chest;
