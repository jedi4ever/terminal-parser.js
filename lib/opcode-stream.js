'use strict';

var ParserStream = require('./parser-stream');
var util = require('util');

function OpcodeStream(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self.settings.decodeStrings = false;
  self.settings.objectMode = true;

  if ( self.settings === undefined) { self.settings.stringify = false; }

  // Call Parent
  ParserStream.call(self, self.settings);
  self.addTransformation(transform);

  if (self.settings.stringify) {
    self.addTransformation(JSON.stringify);
  }

}

util.inherits(OpcodeStream, ParserStream);
module.exports = OpcodeStream;

var transform = function(chunk) {

  var p = chunk;
  var key = [ p.type , p.cmd ].join('-');
  var t = transformations[p.type];

  if (t) {
    var tcmd = t[p.cmd];
    if (tcmd) {
      var o = tcmd(p);
      if ((o === false) || (o === undefined)) {
        return chunk;
      }
      return o;
    } else {
      return chunk;
    }
  } else {
    return chunk;
  }

};

var op = function(actions) {
  return function(p) {
    return { type: 'OP', ops: actions };
  };
};

/*
   var chr = {
   '\x07': op( [ [ 'BELL' ] ] ),
   '\x08': op( [ [ 'BACKSPACE' ] ] ),
   };
   */

var mode = {
  '?4': function(p) { return op([ [ 'setMode', ( p.args === true) ? 'INSERT' : 'REPLACE' ] ])(); },
  '?42': function(p) { return op([ [ 'setMode', ( p.args === true) ? '7 BIT': '8 BIT' ] ])(); },
  '?20': function(p) { return op([ [ 'setMode', ( p.args === true) ? 'LINEFEED': 'NEWLINE' ] ])(); },
};

var sgr = require('./opcodes/sgr');
var csi = require('./opcodes/csi');
var esc = require('./opcodes/esc');
var special = require('./opcodes/special');

var transformations = {
  'sgr': sgr,
  'csi': csi,
  'esc': esc,
  'special': special,
  'mode': mode
};
