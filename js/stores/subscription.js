var W3CWebSocket = require('websocket').w3cwebsocket;
var EventEmitter = require('events').EventEmitter;

var Subscription = function() {
  var client = new W3CWebSocket('ws://localhost:8081/', 'echo-protocol');

  client.onerror = function() {
    console.log('Connection Error');
  };

  client.onopen = function() {
    console.log('WebSocket Client Connected');
  };

  client.onclose = function() {
    console.log('echo-protocol Client Closed');
  };

  var ee = new EventEmitter();

  client.onmessage = function(event) {
    var sub = JSON.parse(event.data).sub;
    ee.emit(sub, event);
  };

  client.onopen = function() {
    ee.emit('connected');
  };

  var subscribe = function (arr) {
    // on open, register subscription
    ee.on('connected', function () {
      arr.map(function(s) {
        ee.on(s.sub, s.callback);
        client.send(JSON.stringify({sub: s.sub}));
      });
    });
  };

  return {
    subscribe: subscribe
  };
};

module.exports = Subscription;
