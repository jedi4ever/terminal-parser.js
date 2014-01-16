'use strict';

//http://aperiodic.net/screen/man:the_virtual_terminal
function parseApc(chunk, st ) {
  var terminator;

  // See if we are passed a custom String Terminator (ST)
  if (st === undefined) {
    terminator = '\x1b\\';
  } else {
    terminator = st;
  }

  // If the chunk is empty , there is no match
  if (chunk === null) {
    return null;
  }

  // If the chunk does not start with ESC, there is no match
  if (chunk[0] !== '\x1b') {
    return null;
  }

  // If the second part of the chunk is not an '_' , there is no match
  if (chunk[1] !== '_') {
    return null;
  }

  // Get the rest of the chunk
  var rest = chunk.slice(2);

  // If there are no chars left, there is no match (although partial)
  if (rest === '') {
    return null;
  }

  // Find the stringTerminator position
  var stPos = rest.indexOf(terminator);

  // If we found it
  if ( stPos >= 0) {
    // Return the command
    var result = {
      type: 'apc',
      cmd: rest.slice(0, stPos),
      length: 2 + stPos + terminator.length
    };
    return result;
  } else {
    return null;
  }

}

module.exports = parseApc;
