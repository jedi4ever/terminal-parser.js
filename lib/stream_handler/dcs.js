'use strict';
// function(cmd, n, m, args, mod);

var emit_func = function(char) {
  return function(cmd, n , m , args, mod) {
    var code = 'DCS'; this.push( { cmd: cmd, code: code, n: n, m: m, args: args, mod: mod });
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
