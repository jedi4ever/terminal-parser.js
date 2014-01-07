'use strict';

var Transform = require('stream').Transform;
var util = require('util');

function TermStream(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self.oldChunk = null;

  self.settings.decodeStrings = false;
  self.settings.objectMode = true;

  // Call Parent
  Transform.call(self, self.settings);

}

util.inherits(TermStream, Transform);
module.exports = TermStream;


TermStream.prototype._transform = function(chunk, encoding, callback) {
  var self = this;

  var len = 1;
  if (typeof chunk !== 'string') {
    chunk = chunk.toString();
  }

  if (this.oldChunk !== null) {
    chunk = this.oldChunk + chunk;
    this.oldChunk = null;
  }

  while (chunk.length > 0 && len > 0) {
    len = this.callHandler('chr', chunk[0], chunk);

    if (len === null) {
      for (len = 1; len < chunk.length && !(chunk[len] in this.handlers.chr); len++) {
      }
      this.push({ code: 'CHAR', data: chunk.substr(0, len)});
    }

    if (len > 0) {
      chunk = chunk.slice(len);
    }
  }
  if (chunk.length !== 0) {
    this.oldChunk = chunk;
  }
  callback(null);
};

TermStream.prototype.callHandler = function(type, cmd) {
  if (!(type in this.handlers && cmd in this.handlers[type])) {
    return null;
  }

  var args = Array.prototype.slice.call(arguments, 1);
  if (typeof this.handlers[type][cmd] === 'string') {
    cmd = this.handlers[type][cmd];
  }

  var result = this.handlers[type][cmd].apply(this, args);

  return result === undefined ? 1 : result;
};

TermStream.prototype.parseCsi = function(chunk) {
  var i;
  var match = CSI_PATTERN.exec(chunk);
  if (match === null) {
    return null;
  }

  var args = match[2] === '' ? [] : match[2].split(';');

  for (i = 0; i < args.length; i++) {
    args[i] = +args[i];
  }

  return {
    args: args,
    mod: match[1],
    cmd: match[3],
    length: match[0].length
  };
};

TermStream.prototype.parseOsc = function(chunk) {
  var match = OSC_PATTERN.exec(chunk);
  if (match === null) {
    return null;
  }

  return {
    arg: match[2].split(';'),
    args: match[2].split(';'),
    cmd: match[1],
    terminated: match[3] === '\x07',
    length: match[0].length
  };
};

TermStream.prototype.parseDcs = function(chunk) {
  var i;
  var match = DCS_PATTERN.exec(chunk);

  if (match === null) {
    return null;
  }

  return {
    args: [null,null],
    mod: match[1],
    cmd: match[1],
    length: match[0].length
  };
};

TermStream.prototype.handlers = {
  chr: require('./stream_handler/chr.js'),
  esc: require('./stream_handler/esc.js'),
  csi: require('./stream_handler/csi.js'),
  sgr: require('./stream_handler/sgr.js'),
  dcs: require('./stream_handler/dcs.js'),
  mode: require('./stream_handler/mode.js'),
  osc: require('./stream_handler/osc.js'),
};

var CSI_PATTERN = /^\x1b\[([?!>]?)([0-9;]*)([@A-Za-z`]?)/;
  var DCS_PATTERN = /^\x1bP([0-9;@A-Za-z`]*)\x1b\\/;
  var OSC_PATTERN = /^\x1b\]([0-9]+);*([^\x07]*)(\x07?)/;
