'use strict';

var util = require('util');

var actions = require('./actions');

function TermBuffer(cols, rows, options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self._buffer = actions.initialize(null, cols, rows);

  // Call Parent
  Object.call(self);

}

module.exports = TermBuffer;

// Inject all buffer actions into TermBuffer
Object.keys(actions).forEach(function(action) {
  var f = actions[action];
  TermBuffer.prototype[action] = function() { // Arguments
    var self = this;

    // Get the arguments passed
    var args = Array.prototype.slice.call(arguments, 0);
    // Add the buffer as the first element
    args.splice(0,0,self._buffer);

    // Now apply the function with the correct arguments
    var result = f.apply(null, args);

    // If it is a get function
    if (action.indexOf('get') === 0) {
      return result;
    } else {
      // If not a get function, it's a transfomration
      self._buffer = result;
      return self;
    }
  };
});
