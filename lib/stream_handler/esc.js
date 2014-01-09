'use strict';
// function(cmd, n, m, args, mod);

var emit_func = function(char) {
  return function(cmd, chunk) {
    var code = 'ESC-'+char; this._push({ code: code, chunk: chunk });
  };
};

var chars = 'abcdefghijklmnopqrstuvwyz'.split('');

var keys = [ '>' , '@', '`', '~' , '}' , '{' , '|' ];

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



// function(cmd, chunk);
module.exports.P = function(cmd, chunk) {
  // ESC P // Device Control String (DCS is 0x90)

  var dcs = this.parseDcs(chunk);
  if (dcs === null || dcs.cmd === '') {
    return 0;
  } else {
    if (dcs.length !== chunk.length && dcs.cmd === '') {
      console.log('Garbaged DCS!');
      return 1;
    }
  }

  var result = this.callHandler('dcs', dcs.cmd, +dcs.args[0], +dcs.args[1], dcs.args, dcs.mod);
  if(result === null) {
    //console.log("Unknown DCS handler " + dcs.cmd);
    return dcs.length;
  }
};


module.exports['['] = function(cmd, chunk) {
  // ESC [
  // Control sequence introducer (CSI)
  var csi = this.parseCsi(chunk);
  if (csi === null || csi.cmd === '') {
    return 0;
  } else {
    if (csi.length !== chunk.length && csi.cmd === '') {
      console.log('Garbaged CSI!');
      return 1;
    }
  }

  var result = this.callHandler('csi', csi.cmd, +csi.args[0], +csi.args[1], csi.args, csi.mod);
  if(result === null) {
    console.log('Unknown CSI handler ' + csi.cmd);
  }
  return csi.length;
};

module.exports[']'] = function(cmd, chunk) {

  // ESC ]
  // 7-bit - Group Separator (GS)
  // 8-bit - Operating System Command (OSC is 0x9d)
  var osc = this.parseOsc(chunk);
  if (osc === null) {
    return 0;
  } else {
    if (osc.length !== chunk.length && osc.terminated === false) {
      console.log('Garbaged OSC!');
      return 1;
    }
  }

  var result = this.callHandler('osc', osc.cmd, osc.arg);
  if (result === null) {
    console.log('Unknown OCS handler ' + osc.cmd);
  }
  return osc.length;
};
