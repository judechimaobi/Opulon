import React, { useState } from 'react';
import './Quest.css';
import menuHover from '../../assets/audio/inner-menu-hover.mp3';
import menuClick from '../../assets/audio/inner-menu-click.mp3';
import btnClick from '../../assets/audio/btn-click.mp3';


const quests = [
  {
    name: "The Lost Treasure of Azura",
    description: "Deep in the heart of the Enchanted Forest lies the Lost Treasure of Azura, rumored to possess the power to grant any wish. Many have ventured into the forest, but few have returned. Your task is to find the treasure and unlock its secrets before it falls into the wrong hands.",
    rules: [
      "Explore the Forest",
      "Collect Clues",
      "Avoid Traps",
      "Face the Guardian",
      "Time Limit: Complete before sunset",
      "Return Safely",
    ],
  },
  {
    name: "The Dragon’s Lair",
    description: "The Dragon’s Lair quest involves entering the dragon’s territory, stealing a rare gem, and escaping unscathed. The lair is filled with treacherous paths and the dragon's minions who guard the gem fiercely.",
    rules: [
      "Stealth is key",
      "Beware of the dragon's minions",
      "Retrieve the gem without waking the dragon",
      "Escape the lair within the time limit",
    ],
  },
  {
    name: "The Cursed Village",
    description: "The village of Eldermoor has been cursed by a dark sorcerer, and its inhabitants have turned into shadowy figures. Your mission is to lift the curse by finding the sorcerer’s hidden talisman and breaking it.",
    rules: [
      "Investigate the village for clues",
      "Defeat the shadow guardians",
      "Locate and destroy the talisman",
      "Protect the villagers from further harm",
    ],
  },
  {
    name: "The Secret of the Crystal Cave",
    description: "Legends speak of a crystal cave that holds the secret to immortality. You are tasked with venturing into the cave, overcoming the crystal creatures, and uncovering the ancient secret.",
    rules: [
      "Find the entrance to the cave",
      "Navigate through the crystal maze",
      "Defeat the crystal creatures",
      "Discover the secret without altering the cave’s balance",
    ],
  },
  {
    name: "The Phantom Ship",
    description: "A mysterious ghost ship has been sighted near the coast, causing fear among the locals. Your mission is to board the ship, uncover the reason for its haunting, and lay the spirits to rest.",
    rules: [
      "Board the ghost ship without getting caught",
      "Communicate with the spirits",
      "Solve the mystery of the ship's curse",
      "Perform a ritual to release the spirits",
    ],
  },
];



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






const Quest = () => {
	const [selectedQuest, setSelectedQuest] = useState(null);
	const [activeTab, setActiveTab] = useState(null);
	
  const handleQuestClick = (quest, index) => {
		menuClickSfx();
		setActiveTab(index);
    setSelectedQuest(quest);
  };
  const handleStartQuestClick = () => {
		btnClickSfx();
  };



  return (
    <div className="questContainer">
			<h3 className="pageTitle">Quest</h3>
			<div className="questInnerContainer">
				<div className="questList">
          {quests.map((quest, index) => (
            <div key={index} className={`listItem ${activeTab === index ? 'active' : ''}`} onClick={() => handleQuestClick(quest, index)} onMouseEnter={menuHoverSfx}>
                {quest.name}
            </div>
          ))}
        </div>

        <div className="questDetails">
          {selectedQuest ? (
            <>
              <h5 className="questTitle">{selectedQuest.name}</h5>
              <div className="desc">
								<p>{selectedQuest.description}</p>
								<h5 className="questSubTitle">RULES</h5>
									<ul>
										{selectedQuest.rules.map((rule, index) => (
											<li key={index}>{rule}</li>
										))}
									</ul>
							</div>
							
							<button className='questBtn' onClick={() => handleStartQuestClick()}>Start Quest</button>
            </>
          ) : (
            <p>Select a quest to see the details.</p>
          )}
        </div>


				
			</div>
		</div>

  );
};

export default Quest;
