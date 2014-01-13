describe('terminal buffer stream', function () {

  it('can handle a string of plain characters', function(done) {
    var stream = new TerminalParser.BufferStream();

    var text = 'beepboop';
    var esc = '\x1b';
    var csi = '\x1b[';
    var csiA = '\x1b[1A';

    var count = 0;
    var t = [
      text,
      csiA
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
