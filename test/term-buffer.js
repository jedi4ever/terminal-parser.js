describe('TermBuffer', function () {

  var TermBuffer = require('../index.js').TermBuffer;

  it('can be initialize', function(done) {
    var t = new TermBuffer(10,20);
    expect(t).not.to.be(null);
    done();
  });

});
