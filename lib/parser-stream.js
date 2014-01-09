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

  for (var i=0; i < self.transformations.length ; i ++) {
    result = self.transformations[i](result);
  }
  self.push(result);

};

TermStream.prototype._transform = function(chunk, encoding, callback) {
  var self = this;

  var len = 1;
  if (typeof chunk !== 'string') {
    chunk = chunk.toString();
  }

  if (this.oldChunk !== null) {
    chunk = this.oldChunk + chunk;
    this.oldChunk = null;
  }

  var length = 0;
  var results = parser.parse(chunk);

  results.forEach(function(r) {
    if (r.type === 'notgood') {
      //process.exit(-1);
    }
    self._push(r);
    length = length + r.length;
  });

  this.oldChunk = chunk.slice(length);
  callback(null);
};

TermStream.prototype.addTransformation = function(transformation) {
  var self = this;

  self.transformations.push(transformation);

};

