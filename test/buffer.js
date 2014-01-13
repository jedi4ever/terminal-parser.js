describe('terminal buffer actions', function () {

  var a = TerminalParser.actions;
  it('cursor_move', function(done) {
    var buffer = {};
    buffer.cursor = { x: 0, y: 0 };
    var n = a.cursor_move(buffer, 0, 1);
    expect(n.cursor.x).to.be(0);
    expect(n.cursor.y).to.be(1);
    done();

  });

  it('cursor_save', function(done) {
    var buffer = {};
    buffer.cursor = { x: 0, y: 4 };
    var n = a.cursor_save(buffer);
    expect(n.ocursor.x).to.be(0);
    expect(n.ocursor.y).to.be(4);
    done();

  });

  it('cursor_save with different ocursor', function(done) {
    var buffer = {};
    buffer.cursor = { x: 1, y: 3 };
    buffer.ocursor = { x: 2, y: 4 };
    var n = a.cursor_save(buffer);
    expect(n.ocursor.x).to.be(1);
    expect(n.ocursor.y).to.be(3);
    done();

  });

  it('cursor_restore', function(done) {
    var buffer = {};
    buffer.cursor = { x: 1, y: 3 };
    buffer.ocursor = { x: 2, y: 4 };
    var n = a.cursor_restore(buffer);
    expect(n.cursor.x).to.be(2);
    expect(n.cursor.y).to.be(4);
    done();

  });

});
