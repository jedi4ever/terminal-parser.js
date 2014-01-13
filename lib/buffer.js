'use strict';

var util = require('util');

function TermBuffer(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self.buffer = {};

  // Call Parent
  Object.call(self);

}

module.exports = TermBuffer;

