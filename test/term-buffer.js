describe('TermBuffer', function () {

  var TermBuffer = require('../index.js').TermBuffer;

  it('can be initialized', function(done) {
    var t = new TermBuffer(80,24);
    expect(t.getCursor()).to.eql({ x:0, y:0});
    expect(t.getSize()).to.eql({ cols: 80, rows: 24});
    done();
  });

  it('can move the cursor', function(done) {
    var t = new TermBuffer(80,24);
    t.moveCursor(10,20);
    expect(t.getCursor()).to.eql({ x: 10, y: 20});
    done();
  });

  it('can set the cursor', function(done) {
    var t = new TermBuffer(80,24);
    t.setCursor(10,20).setCursor(3,3);
    expect(t.getCursor()).to.eql({ x: 3, y: 3});
    done();
  });

  it('can save the cursor', function(done) {
    var t = new TermBuffer(80,24);
    t.saveCursor().moveCursor(10,20).restoreCursor();
    expect(t.getCursor()).to.eql({ x: 0, y: 0});
    done();
  });

  it('can get the size', function(done) {
    var t = new TermBuffer(80,24);
    var size = t.getSize();
    expect(size).to.eql({ cols: 80, rows: 24});
    done();
  });

  it('can get the cols', function(done) {
    var t = new TermBuffer(80,24);
    var cols = t.getCols();
    expect(cols).to.be(80);
    done();
  });

  it('can get the rows', function(done) {
    var t = new TermBuffer(80,24);
    var cols = t.getRows();
    expect(cols).to.be(24);
    done();
  });

  it('can backspace', function(done) {
    var t = new TermBuffer(80,24);
    t.backspace();
    expect(t.getCursorX()).to.be(0);
    expect(t.getCursorY()).to.be(0);
    done();
  });

  it('can backspace', function(done) {
    var t = new TermBuffer(80,24);
    t.newLine();
    t.backspace();
    expect(t.getCursorX()).to.be(79);
    expect(t.getCursorY()).to.be(0);
    done();
  });


});
