describe('parserEsc', function () {

  var text = 'beepboop';
  //var esc = '\033';
  //var esc = '\u001b';
  var esc = '\x1b';
  var parser = require('../index.js').parser;

  it('can handle a string of plain characters', function(done) {

    var token = parser.parseEsc(text);
    expect(token).to.be(null);

    done();
  });

  it('esc + string characters', function(done) {

    var token = parser.parseEsc(esc + text);
    expect(token).to.not.be(null);
    expect(token.cmd).to.be(text[0]);
    expect(token.type).to.be('esc');
    expect(token.length).to.be(2);

    done();
  });

  it('can handle an esc only', function(done) {

    var token = parser.parseEsc(esc);
    expect(token).to.be(null);

    done();
  });

  it('can handle an multi esc', function(done) {
    var t = '\u001bM\b\u001b[J';

    var token = parser.parseEsc(t);
    expect(token).to.not.be(null);
    expect(token.type).to.be('esc');
    expect(token.cmd).to.be('M');
    expect(token.length).to.be(2);

    done();
  });

  it('can handle a multichar esc', function(done) {
    var t = '\x1b(0';

    var token = parser.parseEsc(t);
    expect(token).to.not.be(null);
    expect(token.type).to.be('esc');
    expect(token.cmd).to.be('(');
    expect(token.length).to.be(3);

    done();
  });

  it('can handle an unfinished multichar esc', function(done) {
    var t = '\x1b(';

    var token = parser.parseEsc(t);
    expect(token).to.not.be(null);
    expect(token.type).to.be('esc');
    expect(token.cmd).to.be('(');
    expect(token.final).to.be(false);

    done();
  });

  it('can handle an unfinished multichar esc SP', function(done) {
    var t = '\x1b ';

    var token = parser.parseEsc(t);
    expect(token).to.not.be(null);
    expect(token.type).to.be('esc');
    expect(token.cmd).to.be(' ');
    expect(token.final).to.be(false);

    done();
  });



});
