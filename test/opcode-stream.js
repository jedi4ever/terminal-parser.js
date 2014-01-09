describe('terminal opcode stream', function () {

  it('can handle a string of plain characters', function(done) {
    var stream = new TerminalParser.OpcodeStream();

    var text = 'beepboop';

    stream.on('data', function(token) {
      expect(token.text).to.be(text);
      done();
    });

    stream.write(text);
    stream.end();
  });

  it('can handle CSI characters', function(done) {
    var stream = new TerminalParser.OpcodeStream();

    var text = '\x1b[0;3r';

    stream.on('data', function(token) {
      expect(token.type).to.be('OP');
      expect(token.ops).to.not.be.empty();
      done();
    });

    stream.write(text);
    stream.end();
  });

});
