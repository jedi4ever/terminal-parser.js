'use strict';

var emit_func = function(char) {
  return function(cmd, args) {
    var code = 'SGR'; this.push({ code: code, cmd: cmd, args: args });
  };
};

module.exports = {};

for (var i=0;i<255;i++) {
  module.exports[i] = emit_func(i);
}

