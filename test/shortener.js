var expect = require('chai').expect,
    Shortener = require('../app_modules/Shortener.js');

var MY_ID = 435435,
    MY_SHORTURL = 'i2V2';

describe('Url Shortener', function(done) {

  it('should encode urls', function(){
    var shortener = new Shortener();       
    expect(shortener.encode(MY_ID)).to.equal(MY_SHORTURL);
  });

  it('should decode urls', function(){
    var shortener = new Shortener();        
    expect(shortener.decode(MY_SHORTURL)).to.equal(MY_ID);
  });

});