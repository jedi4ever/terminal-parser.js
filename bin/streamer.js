#!/usr/bin/env node
// -*- mode: javascript -*-
// vi: set ft=javascript :
'use strict';

var Terminal = require('../index.js');
var net = require('net');
var fs = require('fs');
var through = require('through');
var pty = require('pty.js');
var colors = require('colors');

var ps1 = '(\\[\\033[5;31m\\]*\\[\\033[0m\\])';
var penv = JSON.parse(JSON.stringify(process.env));
var nps1 = [ ps1 , process.env['PS1'] ].join('');
penv['PS1'] = nps1;

var ts = new Terminal.TermStream();
var term = pty.spawn('bash' , [ ], {
  cols: process.stdout.columns,
  rows: process.stdout.rows,
  cwd: process.env.HOME,
  //env: { 'PS1' : nps1 } //penv
  env: penv
}, 'ansi');


var stream = require('stream');
var util = require('util');

function OpcodeOutputter() {
  OpcodeOutputter.super_.call(this, { decodeStrings: false, objectMode: true});
};

util.inherits(OpcodeOutputter, stream.Transform);

OpcodeOutputter.prototype._transform = function(chunk, encoding, callback) {
  if (chunk.code === 'OP') {
    this.push(JSON.stringify(chunk).green +'\n');
  } else {
    if (chunk.code === 'CHAR') {
      this.push(JSON.stringify(chunk).blue +'\n');
    } else {
      this.push(JSON.stringify(chunk).red +'\n');
    }
  }
  callback();
};

var outputter = new OpcodeOutputter();

term.setEncoding('utf8');

var opcodes = new Terminal.OpcodeStream();

var socket = net.createConnection('/tmp/terminal-debug');

function write(data) {
  console.log(data);
  this.queue(data) //data *must* not be null
};

function end () { //optional
  this.queue(null)
}

var jsonize = through(write,end);

//var vt100 = fs.createReadStream(process.argv[2], { encoding: 'utf-8' });
if (typeof process.stdin.setRawMode == 'function') {
  process.stdin.setRawMode(true);
};

process.stdin.pipe(term);
term.pipe(process.stdout);
term.pipe(ts).pipe(opcodes).pipe(outputter).pipe(socket); //.pipe(process.stdout);
//term.pipe(ts).pipe(opcodes).pipe(socket); //.pipe(process.stdout);
term.on('end', function() {
  process.exit();
});
//vt100.pipe(ts);
