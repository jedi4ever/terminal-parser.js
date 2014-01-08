'use strict';

var ParserStream = require('./parser-stream.js');
var OpcodeStream = require('./opcode-stream.js');
var parser = require('./parser.js');

module.exports = {
  ParserStream: ParserStream,
  OpcodeStream: OpcodeStream,
  parser: parser
};
