var WebSocketServer = require('websocket').server;
var http = require('http');
var EventEmitter = require("events").EventEmitter;
var SUBS = require('../const/sub');

var MyWebSocket = function () {

  var ee = new EventEmitter();

  var init = function (onInit, onRequest) {
    var server = http.createServer(function(request, response) {
      console.log((new Date()) + ' Received request for ' + request.url);
      response.writeHead(404);
      response.end();
    });

    server.listen(8081, function() {
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

      onInit(ee);

      connection.on('message', function(message) {
        if (message.type === 'utf8') {
          onRequest(ee, message, connection);
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
  };

  return {
    init: init
  };
};

module.exports = MyWebSocket;
