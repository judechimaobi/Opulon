
import React from 'react';
import transitionSfx from '../../assets/audio/transition.mp3';

const entranceSfx = () => {
	const audio = new Audio(transitionSfx);
	audio.play();
};


const FullScreenVideo = ({ onEnd }) => {
	entranceSfx();
	return (
		<div style={{
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			zIndex: 1,
			backgroundColor: 'black'
		}}>
			<video
				src={require('../../assets/videos/transition.mp4')}
				autoPlay={true}
				muted={true}
				preload="auto"
				onEnded={onEnd}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover'
				}}
			/>
		</div>
	);
};

export default FullScreenVideo;
