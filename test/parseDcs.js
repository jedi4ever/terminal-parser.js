describe('parserDcs', function () {

  var text = 'beepboop';
  var esc = '\x1b';
  var dcsA = '\x1bPa\x1b\\';
  var parser = require('../index.js').parser;
  var csiA = '\x1b[0;3a';

  it('can handle a string of plain characters', function(done) {

    var token = parser.parseDcs(text);
    expect(token).to.be(null);

    done();
  });

  it('esc', function(done) {
    var token = parser.parseDcs(esc + text);
    expect(token).to.be(null);
    done();
  });

  it('a csi code only', function(done) {

    var token = parser.parseDcs(csiA);
    expect(token).to.be(null);

    done();
  });

  it('a csiA, esc, text code', function(done) {

    var token = parser.parseDcs( dcsA + csiA + esc + text);
    expect(token.type).to.be('dcs');
    expect(token.cmd).to.be('a');
    expect(token.length).to.be(dcsA.length);

    done();
  });

});
