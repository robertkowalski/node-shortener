var sanitizer = require('sanitizer');

var PostHandler = function(dbStatements, Model, shortener) {
  this.dbStatements = dbStatements;
  this.model = Model;
  this.shortener = shortener;
};

PostHandler.prototype = {
  
  save: function(url, next) {

    this.url = sanitizer.escape(url);
  
    var dbStatementSave = function(callback) {
      this.dbStatements.save(this.model, this.url, function() {
        callback(null, arguments[0], arguments[1]);
      });
    }.bind(this);

    var createShortUrlAndUpdateDb = function(count, url, callback) {
      var shortUrl = this.shortener.encode(count);
      this.dbStatements.update(this.model, url, shortUrl, function() {
        callback(null, arguments[0]);
      });
    }.bind(this);

    var findEntry = function(mongoId, callback) {
      this.dbStatements.find(this.model, {_id: mongoId}, function() {
        callback(null, arguments[0]);
      });
    }.bind(this);

    async.waterfall([
        dbStatementSave,
        createShortUrlAndUpdateDb,
        findEntry
    ], function (err, result) {
      next(result);
    }.bind(this));
  }
};

module.exports = PostHandler;
