'use strict';

var OpcodeStream = require('./opcode-stream');
var TermBuffer = require('./term-buffer');
var util = require('util');

function BufferStream(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self.settings.decodeStrings = false;
  self.settings.objectMode = true;


  self.hasOutput = false;

  // Initialize new TermBuffer
  var termBuffer = new TermBuffer(self.settings.cols, self.settings.rows);
  self.termBuffer = termBuffer;

  // Call Parent
  OpcodeStream.call(self, self.settings);
  self.addTransformation(transform.bind(self));

  setInterval(function() {
    if (self.hasOutput) {
      self.hasOutput = false;
      var json = JSON.stringify(termBuffer.toJson());
      //console.log(json);
      self.push(json);
    }
  }, 100);

}

util.inherits(BufferStream, OpcodeStream);
module.exports = BufferStream;

BufferStream.prototype._flush = function(callback) {
  var self = this;

  // We wait for another run, and only then we stop
  var id = setTimeout(function() {
    self.hasOutput = false;
    callback(null);
  }, 200);

};

var transform = function(operation) {

  var self = this;
  var tBuffer = self.termBuffer;

  if ((operation !== null) && ((operation.type === 'text'))) {
    tBuffer.text(operation.text);
  }

  if ((operation !== null) && ((operation.type === 'OP'))) {
    var ops = operation.ops;

    // Ops is an array
    ops.forEach(function(o) {
      var f = tBuffer[operation.cmd];
      if (f !== undefined) {
        var args = operation.slice(1);
        tBuffer[f](args);
      }
    });

  }

  self.hasOutput = true;

  return null;
  //return tBuffer.toJson();

};
