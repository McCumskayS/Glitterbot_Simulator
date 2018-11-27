var app = require('express')();
server = require('http').createServer(app);
io = require('socket.io').listen(server);

server.listen(80);

io.sockets.on('connection', function(socket){
  socket.emit('action', data);
  socket.on('myEvent', function(data){
    console.log('data');
  });
});
