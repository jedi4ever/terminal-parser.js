describe('parserApc', function () {

  var text = 'beepboop';
  var esc = '\x1b';
  var parser = require('../index.js').parser;

  it('can handle a string of plain characters', function(done) {

    var token = parser.parseApc(text);
    expect(token).to.be(null);

    done();
  });

  it('can handle an apc command', function(done) {

    var t = '\x1b_beepboop\x1b\\';
    var token = parser.parseApc(t);
    expect(token).not.to.be(null);
    expect(token.type).to.be('apc');
    expect(token.cmd).to.be('beepboop');

    done();
  });

  it('can handle an apc command with a custom terminator that does not match', function(done) {

    var t = '\x1b_beepboop\x1b\\';
    var token = parser.parseApc(t, '\x1bX');
    expect(token).to.be(null);

    done();
  });

  it('can handle an apc command with a custom terminator that matches', function(done) {

    var t = '\x1b_beepboop\x1bX';
    var token = parser.parseApc(t, '\x1bX');
    expect(token).not.to.be(null);
    expect(token.type).to.be('apc');
    expect(token.cmd).to.be('beepboop');

    done();
  });

});
