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

  it('can handle an null parse', function(done) {

    var token = parser.parseDcs(null);
    expect(token).to.be(null);

    done();
  });

  it('can handle an esc parse', function(done) {

    var token = parser.parseDcs(esc);
    expect(token).to.be(null);

    done();
  });

  it('can handle an esc-P parse', function(done) {

    var token = parser.parseDcs(esc + 'P');
    expect(token).to.be(null);

    done();
  });

  it('can handle a custom ST', function(done) {

    var customSt= esc + '\\';
    var t = esc + 'P' + text +  customSt;
    var token = parser.parseDcs(t, customSt);
    expect(token).not.to.be(null);
    expect(token.type).to.be('dcs');
    expect(token.cmd).to.be(text);

    done();
  });

  it('can handle a incomplete dcs chunk', function(done) {

    var customSt= esc + '\\';
    var t = esc + 'P' + text ;
    var token = parser.parseDcs(t, customSt);
    expect(token).to.be(null);

    done();
  });


});
