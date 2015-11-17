var W3CWebSocket = require('websocket').w3cwebsocket;
var EventEmitter = require('events').EventEmitter;

var Subscription = function() {
  var client = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');

  client.onerror = function() {
    console.log('Connection Error');
  };

  client.onopen = function() {
    console.log('WebSocket Client Connected');
  };

  client.onclose = function() {
    console.log('echo-protocol Client Closed');
  };
  
  var subscribe = function (sub, callback) {
    client.onopen = function() {
      client.send(JSON.stringify({sub: sub}));
      client.onmessage = callback;
      //el.push(callback);
    };
  };

  return {
    subscribe: subscribe
  };

  /* we need to handle multiple onmessage callbacks ... */

  // var ee = new EventEmitter();
  // var el = [];
  //
  // client.onmessage = function () {
  //   ee.emit('callbacks', function () {
  //     for(ev in el) {
  //       client.onmessage = ev.(ev.func.params);
  //     }
  //   });
  // };
};

module.exports = Subscription;
