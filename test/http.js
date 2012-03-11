var expect = require('chai').expect,
    http = require('http'),
    app = require('../app.js');

describe('app should return http status codes', function(done) {
 
  describe('if no json was posted', function(done) {
    it('it should respond with http status 400', function(done) {
        
      var invalidJSON = '{url: "www.test.de"}';
      var options = {
        method: 'POST',
        host: 'localhost',
        port: 3000,
        path: '/url/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': invalidJSON.length
        }
      };

      var req = http.request(options, function(res, err) {
        res.setEncoding('utf8');
        res.statusCode;
        expect(res.statusCode).to.equal(400);
        done();
      });      
      
      req.write(invalidJSON);
      req.end();
    });
  });

  /* needs DB */  
   describe('if valid json was posted', function(done) {
    it('should respond with http status 200', function(done) {

      var validJSON = {
        url: "www.test.de"
      };
      var options = {
        method: 'POST',
        host: 'localhost',
        port: 3000,
        path: '/url/',
        headers: {
          'Content-Type': 'application/json',
        }
      };

      var req = http.request(options, function(res, err) {
        res.setEncoding('utf8');
        res.statusCode;
        expect(res.statusCode).to.equal(200);
        done();
      });      
      
      req.write(JSON.stringify(validJSON));
      req.end();
    });
  });

  describe('if a PUT is sended', function(done) {
    it('should respond with http status 405', function(done) {

      var validJSON = {
        url: "www.test.de"
      };
      var options = {
        method: 'PUT',
        host: 'localhost',
        port: 3000,
        path: '/url/',
        headers: {
          'Content-Type': 'application/json',
        }
      };

      var req = http.request(options, function(res, err) {
        res.setEncoding('utf8');
        res.statusCode;
        expect(res.statusCode).to.equal(405);
        done();
      });      
      
      req.write(JSON.stringify(validJSON));
      req.end();
    });
  });
  
  describe('if a DELETE is sended', function(done) {
    it('should respond with http status 405', function(done) {

      var validJSON = {
        url: "www.test.de"
      };
      var options = {
        method: 'DELETE',
        host: 'localhost',
        port: 3000,
        path: '/url/',
        headers: {
          'Content-Type': 'application/json',
        }
      };

      var req = http.request(options, function(res, err) {
        res.setEncoding('utf8');
        res.statusCode;
        expect(res.statusCode).to.equal(405);
        done();
      });      
      
      req.write(JSON.stringify(validJSON));
      req.end();
    });
  });
});
