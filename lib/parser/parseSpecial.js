'use strict';

function parseSpecial(chunk) {
  var result = {};
  var special_PATTERN = /(^[\u000e\u000f\u0007\b\t\r\n])+/;
  var match = special_PATTERN.exec(chunk);

  if (match === null) {
    return null;
  }

  result.type = 'special';
  result.cmd = match[0];
  result.length = result.cmd.length;

  if (result.cmd.length === 0) {
    return null;
  } else {
    return result;
  }
}

module.exports = parseSpecial;
