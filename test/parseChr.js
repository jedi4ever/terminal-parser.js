describe('parserChr', function () {

  var text = 'beepboop';
  //var esc = '\033';
  //var esc = '\u001b';
  var esc = '\x1b';
  var parser = require('../index.js').parser;

  it('can handle a string of plain characters', function(done) {

    var token = parser.parseChr(text);
    expect(token).to.not.be(null);
    expect(token.text).to.be(text);
    expect(token.type).to.be('text');
    expect(token.length).to.be(text.length);

    done();
  });

  it('can handle a string + esc + string characters', function(done) {

    var token = parser.parseChr(text);
    expect(token).to.not.be(null);
    expect(token.text).to.be(text);
    expect(token.type).to.be('text');
    expect(token.length).to.be(text.length);

    done();
  });

  it('can handle an esc only', function(done) {

    var token = parser.parseChr(esc);
    expect(token).to.be(null);

    done();
  });


});
