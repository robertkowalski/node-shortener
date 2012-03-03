var PostHandler = function(dbStatements, Model, shortener) {
  this.dbStatements = dbStatements;
  this.model = Model;
  this.shortener = shortener;
};

PostHandler.prototype = {
  
  save: function(req, res) {

    try {
      var url = req.body.url; 
    } catch(e) {

    }
    
    if (!url) {
      res.json({error: 400, reason: 'No url given'}, 400); 
      return;
    }

    this.url = req.body.url;
    this.res = res;
  
    this.dbStatements.save(this, this.model, this.url, this.createShortUrl);  
  },
  
  createShortUrl: function(self, count, url) {
    var shortUrl = this.shortener.encode(count);
    self.update(self, this.model, url, shortUrl);
  },
  
  update: function(self, Url, url, shortUrl) {  
    self.dbStatements.update(self, self.model, url, shortUrl, self.find)
  },
  
  find: function(self, mongoId) {
    self.dbStatements.find(self, self.model, {_id: mongoId}, self.dispatch);  
  },
  
  dispatch: function(self, urlModel) {
    self.res.json({url: urlModel.url, shorturl: urlModel.shorturl, date: urlModel.date}, 200);
  }
};

module.exports = PostHandler;