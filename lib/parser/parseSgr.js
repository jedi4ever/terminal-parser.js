'use strict';

var parseCsi = require('./parseCsi');

function parseSgr(chunk) {
  // We let parseCsi do all the hard work
  var csi = parseCsi(chunk);

  // If not a valid csi 
  if (csi === null) {
    return null;
  }

  // Check for explicit sgr csi
  if (!((csi.cmd === 'm') && (csi.mod === ''))) {
    return null;
  }

  // If we get here we are a good sgi

  /*
     These ISO-8613-3 controls are supported: 
     P s = 3 8 ; 2 ; P r ; P g ; P b → Set foreground color to the closest match in xterm’s palette for the given RGB P r /P g /P b . 
     P s = 3 8 ; 5 ; P s → Set foreground color to the second P s . 
     P s = 4 8 ; 2 ; P r ; P g ; P b → Set background color to the closest match in xterm’s palette for the given RGB P r /P g /P b . 
     P s = 4 8 ; 5 ; P s → Set background color to the second P s .
     */

  var sgr;
  var args = csi.args;

  if ((args[0] === 38) && (args[1] === 2)) {
    sgr = { type: 'sgr' , length: csi.length, cmd: 'fg-rgb' , args: [ args[2], args[3] , args[4] ] };
    return sgr;
  }

  if ((args[0] === 38) && (args[1] === 5)) {
    sgr = { type: 'sgr' , length: csi.length, cmd: 'fg-256', args: [ args[2] ] };
    return sgr;
  }

  if ((args[0] === 48) && (args[1] === 2)) {
    sgr = { type: 'sgr' , length: csi.length, cmd: 'bg-rgb' , args: [ args[2], args[3] , args[4] ] };
    return sgr;
  }

  if ((args[0] === 48) && (args[1] === 5)) {
    sgr = { type: 'sgr' , length: csi.length, cmd: 'bg-256' , args: [ args[2] ] };
    return sgr;
  }

  // If no args are specified do we have a default one???
  if (args.length === 0) {
    return null;
  }

  if (args.length === 1) {
    return { type: 'sgr' , length: csi.length, cmd: args[0], args: args };
  }

  // Hmmm we still need to return the length; but we have multiple elements ...
  // Tofix 
  // If we have multiple args, return an array
  return args.map(function(s) { return { type: 'sgr' , cmd: s, args: args } ; });

}

module.exports = parseSgr;
