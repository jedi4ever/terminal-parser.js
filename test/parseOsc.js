describe('parserOsc', function () {

  var text = 'beepboop';
  var esc = '\x1b';
  var st = esc + '\\';
  var bel = '\x07';
  var osc = esc + ']';
  var csi = esc + '[';
  var apc = esc + '_';
  var parser = require('../index.js').parser;

  it('can handle a string of plain characters', function(done) {

    var token = parser.parseOsc(text);
    expect(token).to.be(null);

    done();
  });

  it('can handle an osc command with standard terminator', function(done) {

    var t = osc + text + st;
    var token = parser.parseOsc(t);
    expect(token).not.to.be(null);
    expect(token.type).to.be('osc');
    expect(token.cmd).to.be('beepboop');

    done();
  });

  it('can handle an osc command with bel terminator', function(done) {

    var t = osc + text + bel;
    var token = parser.parseOsc(t);
    expect(token).not.to.be(null);
    expect(token.type).to.be('osc');
    expect(token.cmd).to.be('beepboop');

    done();
  });


  it('can handle an osc command with a custom terminator that does not match', function(done) {

    var t = osc + text + 'x1b\\';
    var token = parser.parseOsc(t, '\x1bX');
    expect(token).to.be(null);

    done();
  });

  it('can handle an osc command with a custom terminator that matches', function(done) {

    var t = osc +  text + '\x1bX';
    var token = parser.parseOsc(t, '\x1bX');
    expect(token).not.to.be(null);
    expect(token.type).to.be('osc');
    expect(token.cmd).to.be('beepboop');

    done();
  });

  it('can handle an osc command with leading numeric param', function(done) {

    var t = osc +  '0;abcd' + '\x1bX';
    var token = parser.parseOsc(t, '\x1bX');
    expect(token).not.to.be(null);
    expect(token.type).to.be('osc');
    expect(token.cmd).to.be('0;abcd');
    expect(token.m).to.be('abcd');
    expect(token.n).to.be(0);

    done();
  });

  it('can parse', function(done) {
    var t = 'blal' + esc + 'Z' + osc + '0' +  st + csi + '019a' + apc + 'bla' + st + 'beep' + esc + '#8';
    var token = parser.parse(t);
    console.log(token);
    expect(token).not.to.be(null);
    done();
  });


});
