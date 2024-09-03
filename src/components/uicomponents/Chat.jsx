import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Peer } from "peerjs";
import { v4 as uuidv4 } from 'uuid';

import './Chat.css';
import menuHover from '../../assets/audio/inner-menu-hover.mp3';
import menuClick from '../../assets/audio/inner-menu-click.mp3';
import btnClick from '../../assets/audio/btn-click.mp3';
import VideoChat from './VideoChat';
import VideoChatTest from './VideoChatTest';


const socket = io.connect("http://localhost:3001", {
	reconnection: false,
  // autoConnect: false,
});

const Chat = () => {
	const [selectedChat, setSelectedChat] = useState(null);
	const [activeTab, setActiveTab] = useState(null);
	const [videoChatRoomId, setVideoChatRoomId] = useState('');
	const [roomId, setRoomId] = useState('');
	const myPeerRef = useRef();

	const [users, setUsers] = useState([]);
  	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState("");
	const [message, setMessage] = useState("");
	const [currentRoom, setCurrentRoom] = useState(null);

	const [messageReceived, setMessageReceived] = useState("");

	const [currentUser, setCurrentUser] = useState(null);


	const menuHoverSfx = () => {
		const audio = new Audio(menuHover);
		audio.play();
	};
	
	const menuClickSfx = () => {
		const audio = new Audio(menuClick);
		audio.play();
	};

  const handleChatClick = (user, index) => {
		menuClickSfx();
		setActiveTab(index);
    setSelectedChat(user);
		// setRoom(socket.id);
  };

	// const joinRoom = () => {
  //   if (room !== "") {
  //     socket.emit("join_room", room);
  //   }
  // };

  // const sendMessage = () => {
  //   socket.emit("send_message", { message, room });
  // };

  // const handleSendChat = () => {
	// 	// btnClickSfx();
	// 	socket.emit("send_message", {
	// 		message,
	// 	})
  // };

	
	useEffect(() => {
		// const ROOM_ID = uuidv4();
		const ROOM_ID = 10;
		myPeerRef.current = new Peer();

		myPeerRef.current.on('open', id => {
			socket.emit('join-room', ROOM_ID, id);
    });

		socket.on('user-connected', userId => {
			console.log('User connected:' + userId);
		})






		const truncatedAddress = sessionStorage.getItem('pubKey') 
		? `${sessionStorage.getItem('pubKey').slice(0, 10)}....${sessionStorage.getItem('pubKey').slice(-10)}`
		: '';
		const userData = { id: socket.id, walletAddress: sessionStorage.getItem('pubKey'), userId: truncatedAddress };
		socket.emit('user_login', userData); 

		socket.on('user_list', (userList) => {
			setUsers(userList);
			createVideoChatRoomId(socket.id);
	
			// Find the current user in the user list and set it
			const current = userList.find(user => user.id === socket.id);
			if (current) {
				setCurrentUser(current);
				console.log('Current User Set:', current);  // Debug: log the current user
			} else {
				console.error('Current user not found in user list');
			}
		});

			socket.on('disconnect', () => {
				setUsers([]);
			});
			
			// socket.on('private_message', (data) => {
			// 	setMessages(prev => [...prev, data]);
			// });
			socket.on('private_message', (data) => {
				setMessages(prev => [...prev, { type: 'private', ...data }]);
			});

			socket.on('room_message', (data) => {
			setMessages(prev => [...prev, { type: 'room', ...data }]);
		});

		return () => {
			socket.off('user_list');
			socket.off('private_message');
			socket.off('room_message');
		};
	}, [socket])



	

    const createVideoChatRoomId = (mySocketId) => {
        const newRoomId = mySocketId;
        setVideoChatRoomId(newRoomId);
    };


	const sendPrivateMessage = (to) => {
		if (!inputMessage) {
			return;
		}
		// Create a new message object for the sent message
		const newMessage = {
			id: Date.now().toString(),  // Generate a unique ID for the message
			sender: currentUser.id,
			receiver: to,
			message: inputMessage
		};
		
		// Emit the message to the server
		socket.emit('private_message', { to, message: inputMessage });
		
		// Update the state with the new message
		setMessages(prev => [...prev, newMessage]);
		
		// Clear the input field
		setInputMessage("");
	};
	// const sendPrivateMessage = (to) => {
  //   socket.emit('private_message', { to, message: inputMessage });
	// 	setInputMessage("");
  // };

  const createRoom = () => {
    socket.emit('create_room', 'New Room');
  };

//   const joinRoom = (roomId) => {
//     socket.emit('join_room', roomId);
//     setCurrentRoom(roomId);
//   };

  const sendRoomMessage = () => {
    if (currentRoom) {
      socket.emit('room_message', { roomId: currentRoom, message: inputMessage });
      setInputMessage('');
    }
  };

	// function addVideoStream(video, stream) {
  //   video.srcObject = stream 
  //   video.addEventListener('loadedmetadata', () => { // Play the video as it loads
  //       video.play()
  //   })
  //   videoGrid.append(video) // Append video element to videoGrid
	// }

  return (
    <div className="chatContainer">
			<h3 className="pageTitle">Chat</h3>
			<div className="chatInnerContainer">
				<div className="chatList">
					{users.map((user, index) => (
						<div 
							key={index} 
							className={`listItem ${activeTab === index ? 'active' : ''}`} 
							onClick={() => handleChatClick(user, index)} 
							onMouseEnter={menuHoverSfx}
						>
							{user.userId}
						</div>
					))}
				</div>

				<div className="chatDetails">
					{selectedChat ? (
						<>
							<h5 className="chatTitle">{selectedChat.userId}</h5>
							<div className="chatBubbleContainer">
								{
								messages
									// .filter(chat => chat.sender === selectedChat.id || chat.receiver === currentUser.id)  // Filter messages by receiver
									// .filter(chat => chat.sender === currentUser.id)
									// .filter(chat => 
									// 	(chat.sender === selectedChat.id && chat.receiver === currentUser.id) || 
                  //   (chat.sender === currentUser.id && chat.receiver === selectedChat.id)
									// )
									.map((chat) => (
											// <p key={chat.id} className='chatBubble sender'>{chat.message}</p>
										chat.sender === selectedChat.id && chat.receiver === currentUser.id ? (
											<p key={chat.id} className='chatBubble'>{chat.message}</p>
										) : chat.sender === currentUser.id && chat.receiver === selectedChat.id ? (
											<p key={chat.id} className='chatBubble sender'>{chat.message}</p>
										) : null
								))}
								
							</div>
							
							<div className='chatFormContainer'>
								<input 
									type='text' 
									className='messageInput' 
									onChange={(event) => setInputMessage(event.target.value)} 
									value={inputMessage}
								/>
								<button 
									className='sendMessageBtn' 
									onClick={() => sendPrivateMessage(selectedChat.id)}
								>
									Send
								</button>
							</div>
							
							<VideoChat socket={socket} roomId={selectedChat.id} />
						</>
					) : (
						<p>Start Chat</p>
					)}
				</div>
				{/* <VideoChatTest /> */}
			</div>
		</div>

  );
};

export default Chat;
