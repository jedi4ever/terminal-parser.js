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
    expect(token.char).to.be(text[0]);
    expect(token.type).to.be('esc');
    expect(token.length).to.be(2);

    done();
  });

  it('can handle an esc only', function(done) {

    var token = parser.parseChr(esc);
    expect(token).to.be(null);

    done();
  });


});
