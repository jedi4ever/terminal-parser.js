'use strict';

var util = require('util');

var parseCsi = require('./parser/parseCsi');
var parseChr = require('./parser/parseChr');
var parseEsc = require('./parser/parseEsc');
var parseSgr = require('./parser/parseSgr');
var parseOsc = require('./parser/parseOsc');
var parseApc = require('./parser/parseApc');
var parseDcs = require('./parser/parseDcs');
var parseSpecial = require('./parser/parseSpecial');

function parse(chunk, encoding) {

  var buffer = chunk.slice(0);
  var result = [];
  var weGiveUp = false;

  var prevBuffer = buffer.slice(0);
  var counter = 0;


  function pushElement(element) {

    if (element instanceof Array) {
      element.forEach(function(el) {
        result.push(el);
      });
    } else {
      result.push(element);
    }
  }

  while (buffer.length > 0 && !weGiveUp ) {

    var char = parseChr(buffer);

    if (char === null) {

      // Check for special chars
      var special = parseSpecial(buffer);

      if (special !== null) {
        pushElement(special);
        buffer = buffer.slice(special.length);
      } else {

        // Next try escape
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
              if ((csi.cmd === 'm') && (csi.mod === '')) { // we are sgr and no modifier
                var sgr = parseSgr(buffer);
                if (sgr === null) {
                  weGiveUp = true;
                } else {
                  pushElement(sgr);
                }
              } else {
                pushElement(csi);
              }
              buffer = buffer.slice(csi.length);
            }
            break;
            case '_':
              var apc = parseApc(buffer);
            if (apc === null) {
              weGiveUp = true;
            } else {
              buffer = buffer.slice(apc.length);
              pushElement(apc);
            }
            break;
            case ']': // OSC
              var osc = parseOsc(buffer);
            if (osc === null) {
              weGiveUp = true;
            } else {
              buffer = buffer.slice(osc.length);
              pushElement(osc);
            }
            break;
            case 'P': // OSC
              var dcs = parseDcs(buffer);
            if (dcs === null) {
              weGiveUp = true;
            } else {
              buffer = buffer.slice(dcs.length);
              pushElement(dcs);
            }
            break;
            default:
              buffer = buffer.slice(esc.length);
            pushElement(esc);
          }
        }
      }
    } else {
      buffer = buffer.slice(char.length);
      pushElement(char);
    }

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
  parseSpecial: parseSpecial
};
