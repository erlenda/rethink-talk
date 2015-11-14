var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', onConnection);

function onConnection(socket) {
  socket.on('event', onEvent);
  socket.on('disconnect', onDisconnect);
}

function onEvent(data) {
  console.log(JSON.stringify(data, null, 2));
}

function onDisconnect() {
  console.log('disconnect');
}
var PORT = 3000;
server.listen(PORT);
console.log('server listening on localhost:%s', PORT);
