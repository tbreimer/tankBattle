// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', process.env.PORT || 5000);
app.use('/client', express.static(__dirname + '/client'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'client/index.html'));
});
// Starts the server.
server.listen(process.env.PORT || 5000, function() {
  console.log('Starting server on port 5000');
});

/*
setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);
*/

var players = {};

io.on('connection', function(socket) {
  socket.on('new player', function(username, color) {
    players[socket.id] = {
      x: 300,
      y: 300,
      username: username,
      color: color
    };
  });
  socket.on('disconnect', function() {
    delete players[socket.id];
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);