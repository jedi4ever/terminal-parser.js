describe('parser', function () {

  var text = 'beepboop';
  var esc = '\x1b';
  var st = esc + '\\';
  var bel = '\x07';
  var osc = esc + ']';
  var csi = esc + '[';
  var apc = esc + '_';
  var parser = require('../index.js').parser;


  it('can parse', function(done) {
    var t = 'blal' + esc + 'Z' + osc + '0' +  st + csi + '019a' + apc + 'bla' + st + 'beep' + esc + '#8';
    var token = parser.parse(t);
    //console.log(token);
    expect(token).not.to.be(null);
    done();
  });

  it('can parse a terminated string', function(done) {
    var t = 'blal' + '\r\n';
    var token = parser.parse(t)[0];
    expect(token).not.to.be(null);
    expect(token.type).to.be('text');
    expect(token.length).to.be('blal'.length);
    done();
  });

});
