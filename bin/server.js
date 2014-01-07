#!/usr/bin/env node
// -*- mode: javascript -*-
// vi: set ft=javascript :
'use strict';

var net = require('net');
var through = require('through');


var server = net.createServer(function(socket) {
  socket.pipe(process.stdout);
});

server.listen('/tmp/terminal-debug');
