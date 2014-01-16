describe('term_buffer', function () {

  var TermBuffer = require('../index.js').TermBuffer;

  it('can be initialize', function(done) {
    var t = new TermBuffer();
    expect(token).not.to.be(null);
    done();
  });

});
