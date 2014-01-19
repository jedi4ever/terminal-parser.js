describe('terminal buffer stream', function () {

    var text = 'beepboop';
    var esc = '\x1b';
    var csi = '\x1b[';
    var csiA = '\x1b[1A';

  it.skip('can handle set defaults if no params are added ', function(done) {
  });

  it('can handle a string of plain characters', function(done) {
    var options = {
      cols: 80,
      rows: 25
    };
    var stream = new TerminalParser.BufferStream(options);

    var count = 0;
    var t = [
      text,
      text,
      text,
      text,
    ];

    stream.on('data', function(buffer) {
      expect(buffer).not.to.be(null);
      expect(buffer.cursor).not.to.be(null);
      done();
    });

    stream.write(t.join());
    stream.end();
  });

});
