'use strict';

var op = function(actions) {
  return function(p) {
    return { type: 'OP', ops: actions };
  };
};


var esc = {
  '=' : op( [ [ 'modeSet', 'Application Keypad' ] ] ),
  '>' : op( [ [ 'modeSet', 'Normal Keypad' ] ] ),
  'g' : op( [ [ 'Visual Bell' ] ] ),
  ')': function(p) { return op([ [ 'Designate G1 Character Set', p.mod ] ])(); },
  '(': function(p) { return op([ [ 'Designate G0 Character Set', p.mod ] ])(); },
  '7': op( [ [ 'saveCursor' ] ]),  // Save Cursor (DECSC).DECSC
  '8': op( [ [ 'restoreCursor' ] ]), // Restore Cursor (DECRC)
  'M': op( [ [ 'reverseIndex' ] ]), // Reverse Index ( RI is 0x8d).
  'D': op( [ [ 'Index' ] ]) // Index ( IND is 0x84).
};

module.exports = esc;
