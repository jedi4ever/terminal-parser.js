describe('parserSpecial', function () {

  var text = 'beepboop';
  //var esc = '\033';
  //var esc = '\u001b';
  var esc = '\x1b';
  var parser = require('../index.js').parser;

  it('can handle \b inside text', function(done) {
    var token = parser.parseSpecial('two\b');
    expect(token).to.be(null);
    done();
  });

  it('can handle \b at start of text', function(done) {
    var token = parser.parseSpecial('\b');
    expect(token.type).to.be('special');
    expect(token.cmd).to.be('\b');
    done();
  });

});
