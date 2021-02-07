#!/usr/bin/env node

require('dotenv').config();
/**
 * Module dependencies.
 */
var http = require('http');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var cors = require("cors");
const nlp = require('./nlp');

var app = express();


var apiRoutes = require('./api');
/**
 * Get port from environment and store in Express.
 */

var port = process.env.PORT || '4000';
app.set('port', port);

//To allow cross-origin requests
app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());

app.use("/api", apiRoutes);
/**
 * Create HTTP server.
 */

// var server = http.createServer(app);
const server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.debug('Listening on ' + bind);
}

require('./scraper');

// nlp.quickstart();
