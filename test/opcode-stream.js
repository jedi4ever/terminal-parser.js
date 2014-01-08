describe('terminal opcode stream', function () {

  it('can handle a string of plain characters', function(done) {
    var stream = new TerminalParser.OpcodeStream();

    var text = 'beepboop';

    stream.on('data', function(data) {
      expect(data.data).to.be(text);
      done();
    });

    stream.write(text);
    stream.end();
  });

  it('can handle CSI characters', function(done) {
    var stream = new TerminalParser.OpcodeStream();

    var text = '\x1b[0;3r';

    stream.on('data', function(data) {
      expect(data.code).to.be('OP');
      expect(data.ops).to.not.be.empty();
      done();
    });

    stream.write(text);
    stream.end();
  });

});
