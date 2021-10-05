const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'https://chat-app-4cd6e.web.app',
  },
});

app.get('/', function (req, res) {
  res.send('Server is running!');
});

let RoomsAndUsers = [];

function add({name, room, id}) {
  const response = check({name, room});
  if (!response) {
    RoomsAndUsers.push({name, room, id});
    console.log(RoomsAndUsers);
    return true;
  } else {
    console.log(RoomsAndUsers);
    return false;
  }
}

function check({name, room}) {
  const response = RoomsAndUsers.find(function (item) {
    return name === item.name && room === item.room;
  });
  return response;
}

function remove({id}) {
  let roomDetail;
  RoomsAndUsers = RoomsAndUsers.filter(function (item) {
    if (item.id === id) {
      roomDetail = {
        roomName: item.room,
        userName: item.name,
      };
    }
    return item.id !== id;
  });
  console.log(RoomsAndUsers);
  return roomDetail;
}

io.on('connection', function (socket) {
  console.log('user connected!');
  socket.on('details', function ({name, room}) {
    const response = add({name, room, id: socket.id});
    if (response) {
      socket.join(room);
      socket.emit('details', {name, room, condition: true});
    } else {
      socket.emit('details', {name, room, condition: false});
    }
  });

  socket.on('welcome', function ({message, room, name}) {
    socket.emit('welcome', {message, name});
    socket.broadcast
      .to(room)
      .emit('join user', {name, message: name + ' is joined'});
  });
  socket.on('message', function ({name, room, message}) {
    io.to(room).emit('message', {name, message});
  });
  socket.on('typing', function ({name, room, message}) {
    socket.broadcast.to(room).emit('typing', {message});
  });
  socket.on('disconnect', function () {
    try {
      const {roomName, userName} = remove({id: socket.id});
      socket.broadcast
        .to(roomName)
        .emit('left user', {name: userName, message: userName + ' is left!'});
    } catch (err) {
      console.log(err);
    }
    console.log('user disconnected');
  });
});

http.listen(process.env.PORT || 5000, function () {
  console.log('Server is running on port 5000.');
});
