'use strict';

var util = require('util');

function parse(chunk, encoding) {

  var buffer = chunk.slice(0);
  var result = [];
  var weGiveUp = false;

  var prevBuffer = buffer.slice(0);
  var counter = 0;

  var push_sgr = function(a) { var sgr = { type: 'sgr' , cmd: a }; result.push(sgr); };

  while (buffer.length > 0 && !weGiveUp ) {

    var char = parseChr(buffer);

    if (char === null) {
      // No chars?
      var esc = parseEsc(buffer) ;

      if (esc === null) {
        weGiveUp = true;
      } else {
        switch (esc.cmd) {
          case '[':
            var csi = parseCsi(buffer);
          if (csi === null) {
            weGiveUp = true;
          } else {
            buffer = buffer.slice(csi.length);
            if ((csi.cmd === 'm') && (csi.mod === '')) { // we are sgr and no modifier
              csi.args.forEach(push_sgr);
            } else {
              result.push(csi);
            }
          }
          break;
          case '_':
            var apc = parseApc(buffer);
          if (apc === null) {
            weGiveUp = true;
          } else {
            buffer = buffer.slice(apc.length);
            result.push(apc);
          }
          break;
          case ']': // OSC
            var osc = parseOsc(buffer);
          if (osc === null) {
            weGiveUp = true;
          } else {
            buffer = buffer.slice(osc.length);
            result.push(osc);
          }
          break;
          case 'P': // OSC
            var dcs = parseDcs(buffer);
          if (dcs === null) {
            weGiveUp = true;
          } else {
            buffer = buffer.slice(dcs.length);
            result.push(dcs);
          }
          break;
          default:
            buffer = buffer.slice(esc.length);
          result.push(esc);
        }
      }
    } else {
      buffer = buffer.slice(char.length);
      result.push(char);
    }

    /*
       if (prevBuffer.length === buffer.length) {
    // Nothing got parsed ....
    console.log('**'+new Buffer(prevBuffer) + '**');
    weGiveUp = true;
    result.push({
type: 'notgood',
data: prevBuffer,
length: prevBuffer.length
});
} else {
prevBuffer = buffer.slice(0);
}
*/
}


return result;

}

module.exports = {
parse: parse,
       parseChr: parseChr,
       parseEsc: parseEsc,
       parseCsi: parseCsi,
       parseApc: parseApc,
       parseOsc: parseOsc,
       parseDcs: parseDcs,
       parseSgr: parseSgr,
       parseMode: parseMode
};

function parseChr(chunk) {
  var result = {};

  var escPos = chunk.indexOf('\u001b');

  if (escPos >= 0) {
    result.text = chunk.slice(0,escPos);
    result.type = 'text';
    result.length = result.text.length;
  } else {
    result.text = chunk;
    result.type = 'text';
    result.length = result.text.length;
  }

  if (result.text.length === 0) {
    return null;
  } else {
    return result;
  }

}

function parseEsc(chunk) {

  var result = {};
  var needsMore = /[ #%\(\)*+-.\/]/;

  if ((chunk[0] === '\x1b') && (chunk.length > 1)) {

    // Some esc codes need a second argument
    // ESC SP F , ESC SP G, ESC # 3, ESC % @ , ESC ) C ...
    if (needsMore.exec(chunk[1])) {
      if (chunk[2] === undefined) {
        result.final = false;
      } else {
        result.mod = chunk[2];
        result.length = 3;
        result.final = true;
      }
    } else {
      result.length = 2;
      result.final = true;
    }

    result.cmd = chunk[1];
    result.type = 'esc';
  } else {
    result = null;
  }

  return result;

}

// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

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

function parseCsi(chunk) {

  //var CSI_PATTERN = /^\x1b\[([?!>]?)([0-9;]*)([@A-Za-z`]?)/; // ORIG PATTERN

  // \x1b\E = ESC-[
  // [1] followed by ? = DEC , ! = (unknown) , > = (unknown) (? = zero or one occurance)
  // [2] 0;9;... (* = zero or more occurances)
  // [3] final param (anything non of the previous characters
  var CSI_PATTERN = /^\x1b\[([?!>]?)([0-9;]*)([^0-9;?!])/;
  var match = CSI_PATTERN.exec(chunk);

  // 0 = complete match , 1 = first part, 2 = values(; separated) ; 3 = final param;

  if (match === null) {
    return null;
  }

  var args = match[2] === '' ? [] : match[2].split(';');

  for (var i = 0; i < args.length; i++) {
    args[i] = +args[i];
  }

  return {
type: 'csi',
        args: args,
        mod: match[1],
        cmd: match[3],
        length: match[0].length
  };
}

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

function parseDcs(chunk, st ) {
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
  if (chunk[1] !== 'P') {
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
type: 'dcs',
      cmd: rest.slice(0, stPos),
      length: 2 + stPos + terminator.length
    };
    return result;
  } else {
    return null;
  }

}

function parseMode(chunk) {
}

function parseSgr(chunk) {
}


