'use strict';

var util = require('util');

function parse(chunk, encoding) {

  //var self = this;
  var char = parseChr(chunk);

  if (char.token === 'ESC') {
    var esc = parseEsc(chunk);

    if (esc.token === 'ESC-P') {
      var dcs = parseDcs(chunk);
    }

    if (esc.token === 'ESC-[') {
      var csi = parseCsi(chunk);

      if (csi.token === 'CSI-h' || csi.token === 'CSI-l' ) {
        var mode = parseMode(chunk);
      }

      if (csi.token === 'CSI-m') {
        var sgr = parseSgr(chunk);
      }
    }

    if (esc.token === 'ESC-]') {
      var ocs = parseOsc(chunk);
    }
  }

}

module.exports = {
  parse: parse,
  parseChr: parseChr,
  parseCsi: parseCsi,
  parseOsc: parseOsc,
  parseDcs: parseDcs,
  parseEsc: parseEsc,
  parseSgr: parseSgr,
  parseMode: parseMode
};

function parseChr(chunk) {
  var result = {};

  var escPos = chunk.indexOf('\u001b');

  if (escPos >= 0) {
    result.text = chunk.slice(0,escPos);
    result.type = 'text';
    result.length = result.text.length;
  } else {
    result.text = chunk;
    result.type = 'text';
    result.length = result.text.length;
  }

  if (result.text.length === 0) {
    return null;
  } else {
    return result;
  }

}

function parseEsc(chunk) {

  var result = {};

  if ((chunk[0] === '\x1b') && (chunk.length > 1)) {
      result.type = 'esc';
      result.length = 2;
      result.char = chunk[1];
  } else {
    result = null;
  }

  return result;

}


function parseCsi(chunk) {
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
    type: 'csi',
    args: args,
    mod: match[1],
    cmd: match[3],
    length: match[0].length
  };
}

function parseMode(chunk) {
}

function parseSgr(chunk) {
}

function parseOsc(chunk) {
  var match = OSC_PATTERN.exec(chunk);

  if (match === null) {
    return null;
  }

  return {
    type: 'ocs',
    arg: match[2].split(';'),
    args: match[2].split(';'),
    cmd: match[1],
    terminated: match[3] === '\x07',
    length: match[0].length
  };
}

function parseDcs(chunk) {

  var match = DCS_PATTERN.exec(chunk);

  if (match === null) {
    return null;
  }

  return {
    type: 'dcs',
    args: [null,null],
    mod: match[1],
    cmd: match[1],
    length: match[0].length
  };
}

var CSI_PATTERN = /^\x1b\[([?!>]?)([0-9;]*)([@A-Za-z`]?)/;
  var DCS_PATTERN = /^\x1bP([0-9;@A-Za-z`]*)\x1b\\/;
  var OSC_PATTERN = /^\x1b\]([0-9]+);*([^\x07]*)(\x07?)/;
