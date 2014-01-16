'use strict';

function parseChr(chunk) {
  var result = {};

  var Text_PATTERN = /^([^\u001b\u000e\u000f\u0007\b\t\r\n])*/;
var match = Text_PATTERN.exec(chunk);

result.type = 'text';
result.text = match[0];
result.length = result.text.length;

if (result.text.length === 0) {
  return null;
} else {
  return result;
}

}

