'use strict';

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

module.exports = parseEsc;
