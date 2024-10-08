import React from 'react';
import './PopUp.css';

const PopUp = ({ children, visible }) => {
    return (
			<div className={`popup-overlay ${visible ? 'show' : ''}`}>
				<div className="popup-content">
					{children}
				</div>
			</div>
    );
};

export default PopUp;
