const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
});

const users = {};
const rooms = {};

io.on("connection", (socket) => {
  // console.log(`A User Connected: ${socket.id}`);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId); // The current user joins the room
    // console.log(socket.to(roomId));
    io.to(roomId).emit('user-connected', userId); // Send a message to everyone in the room. But This won't work now b/c the user is the only one in the room and the message is not sent to him. 

    // if (rooms[roomId]) {
    //   socket.join(roomId);
    //   rooms[roomId].users.push(userId);
    //   console.log(`User ${userId} joined room ${roomId}`);
    //   socket.to(roomId).emit('user-connected', userId);
    // } else {
    //   console.log(`Room ${roomId} does not exist.`);
    // }
  });

  socket.on('user_login', (userData) => {
    users[socket.id] = userData;
    io.emit('user_list', Object.values(users)); 
  });




  socket.on('private_message', ({ to, message }) => {
    socket.to(to).emit('private_message', {
      sender: socket.id,
      receiver: to,
      message: message
    });
  });

  // socket.on('join-room', (roomId, userId) => {
  //   if (rooms[roomId]) {
  //     socket.join(roomId);
  //     rooms[roomId].users.push(userId);
  //     console.log(`User ${userId} joined room ${roomId}`);
  //     socket.to(roomId).emit('user-connected', userId);
  //   } else {
  //     console.log(`Room ${roomId} does not exist.`);
  //   }
  // });




  socket.on('voice', (data) => {
    socket.broadcast.emit('voice', data);
  });

  socket.on('create_room', (roomName) => {
    const roomId = generateRoomId();
    rooms[roomId] = { name: roomName, users: [] };
    socket.join(roomId);
    io.to(roomId).emit('room_created', { roomId, roomName });
  });

  

  socket.on('room_message', ({ roomId, message }) => {
    io.to(roomId).emit('room_message', {
      sender: socket.id,
      message: message,
      timestamp: Date.now()
    });
  });

  socket.on('disconnect', () => {
    if (users[socket.id]) {
      delete users[socket.id];
      io.emit('user_list', Object.values(users));
    }
    console.log(`User ${socket.id} disconnected`);

    // Handle removing the user from any rooms they were part of
    Object.keys(rooms).forEach(roomId => {
      rooms[roomId].users = rooms[roomId].users.filter(userId => userId !== socket.id);
      socket.to(roomId).emit('user-disconnected', socket.id);
    });
  });

  function generateRoomId() {
    return Math.random().toString(36).substring(7);
  }
});

server.listen(3001, () => console.log('Server running on port 3001'));






// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('join room', (roomId) => {
//     socket.join(roomId);
//     socket.to(roomId).emit('user joined', socket.id);
//   });

//   socket.on('offer', (offer, to) => {
//     socket.to(to).emit('offer', offer, socket.id);
//   });

//   socket.on('answer', (answer, to) => {
//     socket.to(to).emit('answer', answer, socket.id);
//   });

//   socket.on('ice-candidate', (candidate, to) => {
//     socket.to(to).emit('ice-candidate', candidate, socket.id);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//     io.emit('user disconnected', socket.id);
//   });
// });

// server.listen(3001, () => console.log('Server running on port 3001'));











// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.get('/', (req, res) => {
//     res.send('Socket.IO Server is running...');
// });

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });

//     socket.on('voice', (data) => {
//         socket.broadcast.emit('voice', data);
//     });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
