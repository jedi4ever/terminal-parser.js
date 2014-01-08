describe('parserCsi', function () {

  var text = 'beepboop';
  //var esc = '\033';
  //var esc = '\u001b';
  var esc = '\x1b';
  var parser = require('../index.js').parser;
  var csiA = '\x1b[0;3a';

  it('can handle a string of plain characters', function(done) {

    var token = parser.parseCsi(text);
    expect(token).to.be(null);

    done();
  });

  it('esc', function(done) {
    var token = parser.parseCsi(esc + text);
    expect(token).to.be(null);
    done();
  });

  it('a csi code only', function(done) {

    var token = parser.parseCsi(csiA);
    expect(token.type).to.be('csi');
    expect(token.cmd).to.be('a');
    expect(csiA.length).to.be(csiA.length);

    done();
  });

  it('a double csi code', function(done) {

    var token = parser.parseCsi(csiA + csiA);
    expect(token.type).to.be('csi');
    expect(token.cmd).to.be('a');
    expect(csiA.length).to.be(csiA.length);

    done();
  });

  it('a csiA, esc, text code', function(done) {

    var token = parser.parseCsi(csiA + esc + text);
    expect(token.type).to.be('csi');
    expect(token.cmd).to.be('a');
    expect(csiA.length).to.be(csiA.length);

    done();
  });

  it('a esc csiA, esc, text code', function(done) {

    var token = parser.parseCsi(esc + csiA + esc + text);
    expect(token).to.be(null);

    done();
  });

});
