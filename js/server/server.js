var WebSocketServer = require('websocket').server;
var http = require('http');
var EventEmitter = require("events").EventEmitter;
var SUBS = require('../const/sub');

var server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8080, function() {
  console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  console.log(origin);
  return true;
}

wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  var connection = request.accept('echo-protocol', request.origin);

  console.log((new Date()) + ' Connection accepted.');

  var ee = new EventEmitter();

  setInterval(function () {
    console.log('emit ' + SUBS.TEAMS_CHANGED);
    ee.emit(SUBS.TEAMS_CHANGED);
  }, 2500);

  setInterval(function () {
    console.log('emit ' + SUBS.MATCHES_CHANGED);
    ee.emit(SUBS.MATCHES_CHANGED);
  }, 1500);

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      var req = JSON.parse(message.utf8Data);

      if(req.sub === SUBS.MATCHES_CHANGED) {
        ee.on(SUBS.MATCHES_CHANGED, function () {
          connection.sendUTF(JSON.stringify({sub: SUBS.MATCHES_CHANGED, 'n': 'Server says matches has changed'}))
        });
      }
      if(req.sub === SUBS.TEAMS_CHANGED) {
        ee.on(SUBS.TEAMS_CHANGED, function () {
          connection.sendUTF(JSON.stringify({sub: SUBS.TEAMS_CHANGED, teams: [{name: 'ws', id: 1}]}));
        });
      }
    }

    else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });

  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });

});
