var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    Shortener = require('../app_modules/Handler.js'),
    shortener = new Shortener(),
    Url = require('../app_modules/db/Model.js');
    
    chai.use(sinonChai);

  describe('Post Handler', function(done) {
    it('should send an 400 error if the url is empty', function(){
      var statementsSpy = sinon.spy();
      var p = new PostHandler(statementsSpy, Url, shortener);
      
      var reqSpy = sinon.spy(); 
      var myAPI = { 
        json: function() {
          
        }  
      };
      var mock = sinon.mock(myAPI);
      mock.expects('json').withArgs({error: 400, reason: 'No url given'}, 400);
      p.save(reqSpy, myAPI);
      
      mock.verify();
    });
  
  });

