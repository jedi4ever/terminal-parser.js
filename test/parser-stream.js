describe('terminal parser stream', function () {

  it('can handle a string of plain characters', function(done) {
    var ParserStream = TerminalParser.ParserStream;
    var stream = new ParserStream();
    var text = 'beepboop';

    stream.on('data', function(data) {
      expect(data.code).to.be('CHAR');
      expect(data.data).to.be(text);
      done();
    });

    stream.write(text);
    stream.end();
  });

  it('can handle CSI characters', function(done) {
    var ParserStream = TerminalParser.ParserStream;
    var stream = new ParserStream();
    var text = '\x1b[0;3r';

    stream.on('data', function(data) {
      expect(data.code).to.be('CSI');
      expect(data.cmd).to.be('r');
      expect(data.n).to.be(0);
      expect(data.m).to.be(3);
      done();
    });

    stream.write(text);
    stream.end();
  });

});
