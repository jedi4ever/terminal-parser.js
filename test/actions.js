describe.only('terminal buffer actions', function () {

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

  it('detects if at last cols', function(done) {
    var buffer = {};
    buffer.cursor = { x: 79, y: 2 };
    buffer.size = { cols: 80 , rows: 3};
    var n = a.isAtLastCol(buffer);
    expect(n).to.be(true);
    done();

  });

  it('detects if at last row', function(done) {
    var buffer = {};
    buffer.cursor = { x: 79, y: 2 };
    buffer.size = { cols: 80 , rows: 3};
    var n = a.isAtLastRow(buffer);
    expect(n).to.be(true);
    done();

  });

  it('inserts standard text beyond the screen rows', function(done) {
    var buffer = {};
    buffer.cursor = { x: 0, y: 0 };
    buffer.size = { cols: 4 , rows: 2};
    buffer.lines = [];
    var n = a.insertText(buffer, 'a longer text i');
    expect(n.lines.length).to.be(2);
    expect(n.lines[0]).to.eql([ ' ' , 't', 'e', 'x']);
    expect(n.lines[1]).to.eql([ 't' , ' ', 'i']);
    expect(n.cursor.x).to.be(3);
    expect(n.cursor.y).to.be(1);
    done();

  });

  it('is Beyond Last Row', function(done) {
    var buffer = {};
    buffer.cursor = { x: 0, y: 0 };
    buffer.size = { cols: 4 , rows: 2};
    var n = a.isBeyondLastRow(buffer, 2);
    expect(n).to.be(true);
    done();

  });

  it('inserts a new line', function(done) {
    var buffer = {};
    buffer.cursor = { x: 0, y: 0 };
    buffer.size = { cols: 4 , rows: 2};
    buffer.lines = [];
    var n = a.newLine(buffer);
    expect(n.lines.length).to.be(2);
    expect(n.cursor.x).to.be(0);
    expect(n.cursor.y).to.be(1);
    done();
  });

  it('inserts a new line at the last line', function(done) {
    var buffer = {};
    buffer.cursor = { x: 0, y: 1 };
    buffer.size = { cols: 4 , rows: 2};
    buffer.lines = [];
    var n = a.newLine(buffer);
    expect(n.lines.length).to.be(2);
    expect(n.cursor.x).to.be(0);
    expect(n.cursor.y).to.be(1);
    done();
  });

});
