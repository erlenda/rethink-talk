var EventEmitter = require("events").EventEmitter;
var SUBS = require('../const/sub');
var MyWebSocket = require('./myWebSocket.js')();
var r = require('rethinkdb');

var connection = null;

var connect = function (callback) {
  r.connect( {host: 'localhost', port: 28015}, callback);
};

connect(function(err, conn) {
  if (err) throw err;
  connection = conn;
  proc();
});

MyWebSocket.init(onInit, onRequest);

function proc() {
  console.log('proc');
}

function onInit(ee) {
  setInterval(function () {
    console.log('emit ' + SUBS.TEAMS_CHANGED);
    ee.emit(SUBS.TEAMS_CHANGED);
  }, 2500);

  setInterval(function () {
    console.log('emit ' + SUBS.MATCHES_CHANGED);
    ee.emit(SUBS.MATCHES_CHANGED);
  }, 1500);
}

function onRequest(ee, message, connection) {
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
