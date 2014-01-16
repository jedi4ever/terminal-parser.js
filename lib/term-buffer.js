'use strict';

var util = require('util');

var actions = require('./actions');

function TermBuffer(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self._buffer = actions.initialize();

  // Call Parent
  Object.call(self);

}

module.exports = TermBuffer;
