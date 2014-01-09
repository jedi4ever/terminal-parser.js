describe('terminal parser stream', function () {

  it('can handle a string of plain characters', function(done) {
    var ParserStream = TerminalParser.ParserStream;
    var stream = new ParserStream();
    var text = 'beepboop';

    stream.on('data', function(data) {
      expect(data.type).to.be('text');
      expect(data.text).to.be(text);
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
      expect(data.type).to.be('csi');
      expect(data.cmd).to.be('r');
      expect(data.args).to.eql([0, 3]);
      done();
    });

    stream.write(text);
    stream.end();
  });

});
