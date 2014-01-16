'use strict';

var op = function(actions) {
  return function(p) {
    return { type: 'OP', ops: actions };
  };
};

var special = {
  '\u0007': function(p) { return op( [ [ 'BELL' ] ] )(); },
  '\u0008' : op( [ [ 'Backspace' ] ] ),
  '\u0009' : op( [ [ 'Tab' ] ] ),
  '\u000f' : op( [ [ 'SI' ] ] ),
  '\u000e' : op( [ [ 'SO' ] ] ),
  '\x7f' : op( [ [ 'Delete' ] ] ),
  '\x88' : op( [ [ 'TabSet' ] ] ),
  '\n' : op( [ [ 'NewLine' ] ] ),
  '\r' : op( [ [ 'Carriage Return' ] ] )
};

module.exports = special;
