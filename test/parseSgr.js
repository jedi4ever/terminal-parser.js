describe('parserSgr', function () {

  var text = 'beepboop';
  var esc = '\x1b';
  var csi = esc + '[';
  var parser = require('../index.js').parser;

  it('can handle a string of plain characters', function(done) {

    var token = parser.parseSgr(text);
    expect(token).to.be(null);

    done();
  });

  it('esc + string characters', function(done) {

    var token = parser.parseSgr(esc + text);
    expect(token).to.be(null);
    done();
  });

  it('sgr10', function(done) {

    var token = parser.parseSgr(csi + '10' + 'm');
    expect(token).not.to.be(null);
    done();
  });

  it('sgr10-10', function(done) {

    var token = parser.parseSgr(csi + '5;31' + 'm');
    expect(token).not.to.be(null);
    done();
  });


});
