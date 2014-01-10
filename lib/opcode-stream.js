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
      if (o === false) {
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
  '?4': function(p) { return op([ [ 'MODE', ( p.args === true) ? 'INSERT' : 'REPLACE' ] ])(); },
  '?42': function(p) { return op([ [ 'MODE', ( p.args === true) ? '7 BIT': '8 BIT' ] ])(); },
  '?20': function(p) { return op([ [ 'MODE', ( p.args === true) ? 'LINEFEED': 'NEWLINE' ] ])(); },
};

var csi = {
  '@': function(p) { return op([ [ 'INSERT', 'BLANK CHARACTERS', (p.args || 1) ] ])(); },
  'A': function(p) { return op([ [ 'CURSOR', 'MOVE', 0 , -(p.n || 1) ] ])(); },
  'B': function(p) { return op([ [ 'CURSOR', 'MOVE', 0, (p.n || 1)  ] ])(); },
  'C': function(p) { return op([ [ 'CURSOR', 'MOVE', (p.n || 1) , 0 ] ])(); },
  'D': function(p) { return op([ [ 'CURSOR', 'MOVE', -(p.n || 1) , 0 ] ])(); },
  'E': function(p) { return op([ [ 'CURSOR', 'MOVE', 0 , (p.n ||1) ] , [ 'CURSOR' , 'SET', 0, null ] ])(); },
  'J': function(p) { return op([ [ 'ERASE', 'DISPLAY' , (p.n || 0) ] ])(); },
  'K': function(p) { return op([ [ 'ERASE', 'INLINE' , (p.n || 0) ] ])(); },
  'H': function(p) { return op([ [ 'CURSOR', 'SET' , (p.m || 1) - 1 , (p.n || 1) -1  ] ])(); },
  'q': function(p) { return op([ [ 'LED', 'SET' , p.n  ] ])(); },
  'r': function(p) { return op([ [ 'SCROLLREGION', 'SET' , (p.n || 1) -1 , (p.m || 80) - 1 ] ])(); }, //TODO
  'P': function(p) { return op([ [ 'DELETE', 'CHAR' , (p.args[1] || 1) ] ])(); },

  'l': function(p) {
    var result = [];

    var l = {
      '2'  : 'Keyboard Action' ,
      '4'  : 'Replace Mode' ,
      '12' : 'Send/Receive' ,
      '20' : 'Normal Linefeed' ,
      '34' : 'Normal Cursor Visbility' ,

      '?1' : 'Normal Cursor Keys' ,
      '?2' : 'Designate VT52 Mode' ,
      '?3' : '80 Column Mode' ,
      '?4' : 'Jump (Fast) Scroll' ,
      '?5' : 'Normal Video',
      '?25' : 'Hide Cursor' ,
      '?1000' : 'Dont send Mouse X & Y on button press and release.',
      '?1049' : 'Use Normal Screen Buffer and restore cursor as in DECRC',
    };

    p.args.forEach(function(a) {
      var code = l[p.mod + a];
      if (code !== undefined) {
        if (p.mod === '') {result.push([ 'Reset Mode', code]); }
        if (p.mod === '?') {result.push([ 'DEC Private Mode Reset', code]); }
      }
    });

    if (result.length !== p.args.length) { // No all codes got converted
      return false;
    } else {
      return op(result)();
    }
  }, //TODO

  'h': function(p) {
    var result = [];

    var h = {
      '?1': 'Application Cursor Keys',
      '?25': 'Show Cursor',
      '34' : 'Normal Cursor Visibility',
      '?1000' : 'Send Mouse X & Y on button press and release.',
      '?1049' : 'Save cursor as in DECSC and use Alternate Screen Buffer, clearing it first.',
    };

    p.args.forEach(function(a) {
      var code = h[p.mod + a];
      if (code !== undefined) {
        if (p.mod === '') {result.push([ 'Set Mode', code]); }
        if (p.mod === '?') {result.push([ 'DEC Private Mode Set', code]); }
      }
    });

    if (result.length !== p.args.length) { // No all codes got converted
      return false;
    } else {
      return op(result)();
    }
  }, //TODO
};

var esc = {
  '=' : op( [ [ 'Application Keypad' ] ] ),
  '>' : op( [ [ 'Normal Keypad' ] ] ),
  'g' : op( [ [ 'Visual Bell' ] ] ),
  ')': function(p) { return op([ [ 'Designate G1 Character Set', p.mod ] ])(); },
  '(': function(p) { return op([ [ 'Designate G0 Character Set', p.mod ] ])(); },
};

var sgr = {
  '0': op( [ [ 'ATTR', 'RESET' ] ] ),
  '1': op( [ [ 'ATTR', 'BOLD', 'ON' ] ] ),
  '3': op( [ [ 'ATTR', 'ITALIC', 'ON' ] ] ),
  '4': op( [ [ 'ATTR', 'UNDERLINE', 'ON' ] ] ),
  '5': op( [ [ 'ATTR', 'BLINK', 'ON' ] ] ),
  '7': op( [ [ 'ATTR', 'INVERSE', 'ON' ] ] ),
  '8': op( [ [ 'ATTR', 'HIDDEN', 'ON' ] ] ),
  '9': op( [ [ 'ATTR', 'STRIKE', 'ON' ] ] ),
  '22': op( [ [ 'ATTR', 'BOLD', 'OFF' ] ] ),
  '23': op( [ [ 'ATTR', 'ITALIC', 'OFF' ] ] ),
  '24': op( [ [ 'ATTR', 'UNDERLINE', 'OFF' ] ] ),
  '25': op( [ [ 'ATTR', 'BLINK', 'OFF' ] ] ),
  '27': op( [ [ 'ATTR', 'INVERSE', 'OFF' ] ] ),
  '30': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd) - 30 ] ])(); },
  '31': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd) - 30 ] ])(); },
  '32': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd) - 30 ] ])(); },
  '33': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd) - 30 ] ])(); },
  '34': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd) - 30 ] ])(); },
  '35': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd) - 30 ] ])(); },
  '36': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd) - 30 ] ])(); },
  '37': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd) - 30 ] ])(); },
  '38': function(p) { return op([ [ 'ATTR', 'FG', (+p.args) ] ])(); },
  '39': op( [ [ 'ATTR', 'RESET', 'FG' ] ] ),
  '40': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd) - 40 ] ])(); },
  '41': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd) - 40 ] ])(); },
  '42': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd) - 40 ] ])(); },
  '43': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd) - 40 ] ])(); },
  '44': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd) - 40 ] ])(); },
  '45': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd) - 40 ] ])(); },
  '46': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd) - 40 ] ])(); },
  '47': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd) - 40 ] ])(); },
  '48': function(p) { return op([ [ 'ATTR', 'BG', (+p.args) ] ])(); },
  '49': op( [ [ 'ATTR', 'RESET', 'BG' ] ] ),
  '51': op( [ [ 'ATTR', 'FRAME:BOX' ] ] ),
  '52': op( [ [ 'ATTR', 'FRAME:CIRCLE' ] ] ),
  '53': op( [ [ 'ATTR', 'OVERLINED' ] ] ),
  '90': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd - 90 + 8) ] ])(); },
  '91': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd - 90 + 8) ] ])(); },
  '92': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd - 90 + 8) ] ])(); },
  '93': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd - 90 + 8) ] ])(); },
  '94': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd - 90 + 8) ] ])(); },
  '95': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd - 90 + 8) ] ])(); },
  '96': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd - 90 + 8) ] ])(); },
  '97': function(p) { return op([ [ 'ATTR', 'FG', (+p.cmd - 90 + 8) ] ])(); },
  '100': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd - 100 + 8) ] ])(); },
  '101': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd - 100 + 8) ] ])(); },
  '102': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd - 100 + 8) ] ])(); },
  '103': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd - 100 + 8) ] ])(); },
  '104': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd - 100 + 8) ] ])(); },
  '105': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd - 100 + 8) ] ])(); },
  '106': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd - 100 + 8) ] ])(); },
  '107': function(p) { return op([ [ 'ATTR', 'BG', (+p.cmd - 100 + 8) ] ])(); },
};

var transformations = {
  'sgr': sgr,
  'csi': csi,
  'mode': mode,
  'esc': esc,
};
