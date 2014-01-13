'use strict';

var OpcodeStream = require('./opcode-stream');
var util = require('util');
var actions = require('./actions');

function BufferStream(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self.settings.decodeStrings = false;
  self.settings.objectMode = true;


  self.screenbuffer = {};

  // Initialize buffer
  var b = self.screenbuffer;
  b.cursor = { x: 0, y: 0};

  // Call Parent
  OpcodeStream.call(self, self.settings);
  self.addTransformation(transform.bind(self));

}

util.inherits(BufferStream, OpcodeStream);
module.exports = BufferStream;

var transform = function(operation) {

  var buffer = this.screenbuffer;

  if ((operation !== null) && (operation.type === 'OP')) {
    var ops = operation.ops;
    var r = buffer;

    var sendOrig = true;
    // Ops is an array
    ops.forEach(function(o) {
      var cmd = o[0];
      var args = o.slice(1);
      args.splice(0,0, buffer);
      var f = actions[cmd];

      if (f !== undefined) {
        r = f.apply(null, args);
        sendOrig = false;
      }
    });

    if (sendOrig) {
      return null;
    } else {
      return r;
    }

  } else {
      return null;
  }

};
