'use strict';

var OpcodeStream = require('./opcode-stream');
var util = require('util');
var actions = require('./actions');

function FilterStream(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self.settings.decodeStrings = false;
  self.settings.objectMode = true;
  self.settings.filter = 'text';

  // Call Parent
  OpcodeStream.call(self, self.settings);
  self.addTransformation(transform.bind(self));

}

util.inherits(FilterStream, OpcodeStream);
module.exports = FilterStream;

var transform = function(operation) {

  var self = this;
  if ((operation !== null) && (operation.type === self.settings.filter)) {
    return operation.text;
  } else {
      return null;
  }

};
