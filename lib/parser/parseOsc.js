'use strict';

function parseOsc(chunk, st ) {
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

  // If the second part of the chunk is not an ']' , there is no match
  if (chunk[1] !== ']') {
    return null;
  }

  // Get the rest of the chunk
  var rest = chunk.slice(2);

  // If there are no chars left, there is no match (although partial)
  if (rest === '') {
    return null;
  }

  // Find the stringTerminator position (could be ST or BEL)
  var stPos = rest.indexOf(terminator);

  var belPos = rest.indexOf('\x07');

  var terminatorPos = -1; // Intially we have no terminator found

  if (stPos >= 0) { // If we have stPosition , use this as our first guess for terminatorPosition
    terminatorPos = stPos;
  }

  if (belPos >= 0) { // If we have belPosition too
    if (terminatorPos >= 0) { // and we already got a terminatorPosition 
      terminatorPos = Math.min(belPos, stPos); // calcultate the smallest matching Position
    } else {
      terminatorPos = belPos; // otherwise use the belPosition
    }
  }

  var terminatorLength;
  if (belPos === terminatorPos) {
    terminatorLength = 1;
  }

  if (stPos === terminatorPos) {
    terminatorLength = terminator.length;
  }

  // If we found a terminator ST or BEL
  if ( terminatorPos >= 0) {

    var cmd = rest.slice(0, terminatorPos);
    // Return the command
    var result = {
      type: 'osc',
      cmd: cmd,
      length: 2 + terminatorPos + terminatorLength
    };

    // OSC P s ; P t ST
    // OSC P s ; P t BEL
    // P s  - A single (usually optional) numeric parameter, composed of one of more digits.
    // P t  - A text parameter composed of printable characters.

    var cmdPattern = /([0-9]+);(.*)/;
    var match = cmdPattern.exec(cmd);

    if (match !== null) {
      result.n = +match[1]; // convert to digit
      result.m = match[2];
    }

    return result;
  } else {
    return null;
  }

}
