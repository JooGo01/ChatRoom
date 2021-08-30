//const

const express= require('express');
const app=express();
const http = require('http');
const path = require('path');
const port= process.env.PORT || 3000;
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./public/functions/msg');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./public/functions/user');

//settings

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//static files

app.use(express.static(path.join(__dirname, 'public')));

// functions

const bot = 'GodNow Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(bot, 'Welcome, I was waiting for you!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(bot, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(bot, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

//routes

app.use(require('./routes/indexRoutes'));

//listening port

server.listen(port, () =>
{
 console.log('server on port');    
});