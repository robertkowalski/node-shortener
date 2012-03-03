
/**
 * Module dependencies.
 */

var express = require('express'), 
    routes = require('./routes'), 
    mongoose = require('mongoose'), 
    db = mongoose.connect('mongodb://localhost/urlshortener'),
    // require Url ODM Model
    Url = require('./app_modules/db/Model.js'),
    // require Getter & Setter for DB 
    DbHelper = require('./app_modules/db/DbStatements.js'),
    statements = new DbHelper(db),
    // shortener
    Shortener = require('./app_modules/Shortener.js')
    shortener = new Shortener(),
    // Handler / Delegation
    PostHandler = require('./app_modules/Handler.js');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// curl -i -H "Content-Type: application/json" -H "Accept: application/json" -X POST -d '{"url": "kowalski.gd"}' http://localhost:3000/url/

var p = new PostHandler(statements, Url, shortener);
// Routes
app.post('/url/', function(req, res){
  res.contentType('application/json'); 
  p.save(req, res);
});

app.get('/url/:shorturl', function(req, res){
  res.contentType('application/json');

  this.response = function(u) {
    if (!u.shorturl) {
      res.json({error: 404, reason: 'Not found!'}, 404);
      return;
    }
    res.json({
      shorturl: u.shorturl,
      url: u.url,
    }, 200);
  };
  
  statements.find(this, Url, { shorturl: req.params.shorturl }, this.response);
});

app.put('/url/', function(req, res) {
  res.contentType('application/json'); 
  res.json({error: 405, reason: 'Method not allowed'}, 405);
});

app.del('/url/', function(req, res) {
  res.contentType('application/json');  
  res.json({error: 405, reason: 'Method not allowed'}, 405);
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
