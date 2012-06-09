
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    mongoose = require('mongoose'),
    sanitizer = require('sanitizer'),
    db = mongoose.connect('mongodb://localhost/nshortener'),
    // require Url ODM Model
    Url = require('./app_modules/db/Model'),
    // require Getter & Setter for DB
    DbHelper = require('./app_modules/db/DbStatements'),
    statements = new DbHelper(db),
    // shortener
    Shortener = require('./app_modules/Shortener')
    shortener = new Shortener(),
    // Handler / Delegation
    PostHandler = require('./app_modules/Handler'),
    async = require('async'),
    MemStore = express.session.MemoryStore,
    check = require('validator').check;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'alessios', store: MemStore({
    reapInterval: 60000 * 10
  })}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// curl -i -H "Content-Type: application/json" -H "Accept: application/json" -X POST -d '{"url": "kowalski.gd"}' http://localhost:3000/api/

var postHandler = new PostHandler(statements, Url, shortener);
// Routes
app.post('/api/', function(req, res){
  res.contentType('application/json');
  if (!req.body || !req.body.url) {
    res.json({error: 400, reason: "No url given"}, 400);
    return;
  }

  try {
    var url = req.body.url;
    check(url).isUrl();
    var re = /^http:/;
    if (!re.test(url)) {
      url = 'http://' + url;
    }
    postHandler.save(url, function(urlModel) {
      res.json({url: urlModel.url, shorturl: urlModel.shorturl, date: urlModel.date}, 200);
    });
  } catch (e) {
    res.json({error: 400, reason: "Bad url"}, 400);
    return;
  }
});

app.get('/api/random', function(req, res){
  res.contentType('application/json');

  this.response = function(u) {
    res.json({
      shorturl: u.shorturl,
      url: sanitizer.escape(u.url),
    }, 200);
  };

  Url.count({}, function(err, count) {
    var docId = Math.floor(Math.random() * (count - 0 + 1)) + 0;
    statements.find(Url, { id: docId }, this.response);
  });
});

app.get('/api/:shorturl', function(req, res){
  res.contentType('application/json');

  this.response = function(u) {
    if (!u.shorturl) {
      res.json({error: 404, reason: "Not found!"}, 404);
      return;
    }
    res.json({
      shorturl: u.shorturl,
      url: sanitizer.escape(u.url),
    }, 200);
  };

  statements.find(Url, { shorturl: req.params.shorturl }, this.response);
});

app.put('/api/', function(req, res) {
  res.contentType('application/json');
  res.json({error: 405, reason: "Method not allowed"}, 405);
});

app.del('/api/', function(req, res) {
  res.contentType('application/json');
  res.json({error: 405, reason: "Method not allowed"}, 405);
});

app.post('/post', function(req, res){

  if (!req.body || !req.body.url) {
    res.contentType('application/json');
    res.json({error: 400, reason: "No url given"}, 400);
    return;
  }

  try {
    var url = req.body.url;
    check(url).isUrl();
    var re = /^http:/;
    if (!re.test(url)) {
      url = 'http://' + url;
    }
    postHandler.save(url, function(urlModel) {
      req.session.url = urlModel.url;
      req.session.shorturl = urlModel.shorturl;
      res.json({url: "done"}, 200);
    });
  } catch (e) {
    res.contentType('application/json');
    res.json({error: 400, reason: "Bad url"}, 400);
    return;
  }
});

app.get('/done', function(req, res){

  if (!req.session.url || !req.session.shorturl) {
    res.render('error', {
      reason: 'Please submit a url',
      title: 'node shortener'
    });
    return;
  }
  res.render('result', {
    url: req.session.url,
    shorturl: req.session.shorturl,
    title: 'node shortener'
  });
});

app.get('/jump/:shorturl', function(req, res){

  this.response = function(u) {
    if (!u.shorturl) {
      res.render('error', {
        reason: 'Please submit a url',
        title: 'node shortener'
      });
      return;
    }
    res.redirect(u.url, 301);
  };

  if (req.params.shorturl) {
    statements.find(Url, { shorturl: req.params.shorturl }, this.response);
  }
});

app.get('/random', function(req, res){

  this.response = function(u) {
    res.redirect(u.url, 301);
  };

  Url.count({}, function(err, count) {
    var docId = Math.floor(Math.random() * (count - 0 + 1)) + 0;
    statements.find(Url, { id: docId }, this.response);
  });
});

app.get('/', function(req, res){
  res.render('index', {title: 'node shortener'});
});



app.listen(process.env['app_port'] || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
