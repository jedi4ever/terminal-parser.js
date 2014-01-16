'use strict';

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
