'use strict';

var Transform = require('stream').Transform;

var util = require('util');
var parser = require('./parser');

function TermStream(options) {

  var self = this;

  if (options === undefined) {
    self.settings = {};
  } else {
    self.settings = JSON.parse(JSON.stringify(options));
  }

  self.oldChunk = null;

  self.settings.decodeStrings = false;
  self.settings.objectMode = true;
  self.transformations = [];

  // Call Parent
  Transform.call(self, self.settings);

}

util.inherits(TermStream, Transform);
module.exports = TermStream;


TermStream.prototype._push = function(chunk, encoding, callback) {
  var self = this;
  var result = chunk;

  var okToSend = true;
  result.date = new Date();

  for (var i=0; i < self.transformations.length ; i ++) {
    result = self.transformations[i](result);

    // If a transformation emits null, we don't push the result
    if (result === null) {
      okToSend = false;
    }
  }

  if (okToSend) {
    self.push(result);
  }

};

TermStream.prototype._transform = function(chunk, encoding, callback) {
  var self = this;

  var buffer;

  var len = 1;
  if (typeof chunk !== 'string') {
    buffer = chunk.toString();
  } else {
    buffer = chunk.slice(0);
  }

  // Reset old chunk
  if (self.oldChunk !== null) {
    chunk = self.oldChunk + buffer;
    self.oldChunk = null;
  }

  var length = 0;
  var results = parser.parse(buffer);

  results.forEach(function(r) {
    if (r.type === 'notgood') {
      //console.log('nogogoodododo');
      //process.exit(-1);
    }
    self._push(r);
    length = length + r.length;
  });

  self.oldChunk = buffer.slice(length);
  callback(null);
};

TermStream.prototype.addTransformation = function(transformation) {
  var self = this;

  self.transformations.push(transformation);

};

