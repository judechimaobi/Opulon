
// import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
// import io from 'socket.io-client';

// // Create the SocketContext
// const SocketContext = createContext();

// // Hook to use the SocketContext
// export const useSocket = () => {
//   return useContext(SocketContext);
// };

// // SocketProvider component
// export const SocketProvider = ({ children }) => {
//   const [users, setUsers] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [players, setPlayers] = useState({}); // Multiplayer players state
//   const socket = useRef(null);

//   useEffect(() => {
//     // Connect to the socket server
//     socket.current = io.connect("http://localhost:3001");

//     socket.current.on('connect', () => {
//       console.log("Connected to the server");
//     });

//     // Handle incoming users list (if relevant for your app)
//     socket.current.on('user_list', (userList) => {
//       setUsers(userList);
//     });

//     // Handle incoming private messages
//     socket.current.on('private_message', (message) => {
//       setMessages(prevMessages => [...prevMessages, message]);
//     });

//     // Multiplayer: Handle receiving the current list of players
//     socket.current.on('currentPlayers', (players) => {
//       setPlayers(players);
//     });

//     // Multiplayer: Handle new player joining
//     socket.current.on('newPlayer', (newPlayer) => {
//       setPlayers((prev) => ({ ...prev, [newPlayer.id]: newPlayer }));
//     });

//     // Multiplayer: Handle player updates (position and rotation)
//     socket.current.on('updatePlayer', (updatedPlayer) => {
//       setPlayers((prev) => ({ ...prev, [updatedPlayer.id]: updatedPlayer }));
//     });

//     // Multiplayer: Handle player disconnecting
//     socket.current.on('removePlayer', (playerId) => {
//       setPlayers((prev) => {
//         const updatedPlayers = { ...prev };
//         delete updatedPlayers[playerId];
//         return updatedPlayers;
//       });
//     });

//     // Clean up on component unmount
//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);

//   // Send a private message
//   const sendPrivateMessage = (receiverId, message) => {
//     socket.current.emit('private_message', { to: receiverId, message });
//   };

//   // Multiplayer: Update the current user's avatar position and rotation
//   const updateAvatar = (position, rotation) => {
//     socket.current.emit('updateAvatar', { position, rotation });
//   };

//   // Value to be provided to the components that consume this context
//   const value = {
//     users,
//     messages,
//     currentUser,
//     sendPrivateMessage,
//     players,         // Multiplayer players object
//     updateAvatar,    // Method to update avatar position/rotation
//     socket,          // Socket reference
//   };

//   return (
//     <SocketContext.Provider value={value}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


















import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import io from 'socket.io-client';

// Create the SocketContext
const SocketContext = createContext();

// Hook to use the SocketContext
export const useSocket = () => {
  return useContext(SocketContext);
};

// SocketProvider component
export const SocketProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const socket = useRef(null);

  useEffect(() => {
    // Connect to the socket server
    socket.current = io.connect("http://localhost:3001");

    socket.current.on('connect', () => {
      console.log("Connected to the server");
    });

    // Clean up on component unmount
    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Send private message function
  const sendPrivateMessage = (receiverId, message) => {
    socket.current.emit('private_message', { to: receiverId, message });
  };

  // Value to be provided to the components that consume this context
  const value = {
    users,
    messages,
    currentUser,
    sendPrivateMessage,
    socket,  // Pass the socket instance
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
