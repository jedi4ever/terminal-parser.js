'use strict';
// function(cmd, n, m, args, mod);

var emit_func = function(char) {
  return function(cmd, n , m , args, mod) {
    var code = 'CSI'; this.push( { cmd: cmd, code: code, n: n, m: m, args: args, mod: mod });
  };
};

var chars = 'abcdefghijklmnopqrstuvwyz'.split('');

var keys = [ '@', '`', '~' , '}' , '{' , '|' ];

// Add handlers for all chars
chars.forEach(function(char) {
  keys.push(char);
  keys.push(char.toUpperCase());
});

module.exports = {};

// Add handlers for all keys
keys.forEach(function(key) {
  module.exports[key] = emit_func(key);
});

// CSI Pm h
// Set Mode (SM)
// CSI ? Pm h - mouse escape codes, cursor escape codes
module.exports.h = function(cmd, n, m, args, mod) {
  for(var i = 0; i < args.length; i++) {
    this.callHandler('mode', mod+args[i], true);
  }
};

// CSI Pm l  Reset Mode (RM)
// CSI ? Pm l
module.exports.l =  function(cmd, n, m, args, mod) {
  for(var i = 0; i < args.length; i++) {
    this.callHandler('mode', mod+args[i], false);
  }
};


// CSI Pm m
// Character Attributes (SGR)
// CSI > Ps; Ps m
module.exports.m =  function(cmd, n, m, args, mod) {
  // Set graphic rendition
  var i = 0;
  while (i < args.length) {
    // 255 Foreground Color ESC[38;5;<fgcode>m
    if (args[i] === 38 && args[i+1] === 5) {
      this.callHandler('sgr', args[i], args[i+2] );
      i= i+3;
    } else if (args[i] === 48 && args[i+1] === 5) {
      // 255 Background Color ESC[48;5;<fgcode>m
      this.callHandler('sgr', args[i], args[i+2]);
      i= i+3;
    } else {
      // Regular , Single digit SGR code
      this.callHandler('sgr', args[i]);
      i++;
    }
  }

  if (i === 0) {
    this.callHandler('sgr',0);
  }

};
