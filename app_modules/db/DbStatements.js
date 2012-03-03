var DbHelper = function(db) {
  this.db = db;  
};

DbHelper.prototype =  {
  
  /**
   * @public
   * @param {Object} the mongoose Model for url
   * @param {Object} the longurl e.g. "kowalski.gd"
   * @param {Object|Function} callback
   */
  save: function(self, Model, longurl, next) {
    Model.count({}, function(err, count) {
      var url = new Model({
        id: count,
        shorturl: '',
        url: longurl,
        date: new Date()
      });
      
      url.save(function(err) {
        if (!err) {
          return next(self, count, url);
        }    
      });
    });
  },

  /**
   * @public
   * @param {Object} the mongoose Model for url
   * @param {Object} the mongoId e.g. _id: 4f4bf219bb4e72e020000001
   * @param {String} the shorturl
   * @param {Object|Function} callback
   */
  update: function(self, Model, url, shortUrl, next) {
    var query = { _id: url._id };
    Model.update(query, { shorturl: shortUrl }, {}, function() { 
      next(self, url._id);
    });
  },

  /**
   * @public
   * @param {Object} the mongoose Model for url
   * @param {Object} the searchQuery object, e.g. { shorturl: "cFbHS" }
   * @param {Object|Function} callback
   */
  find: function(self, Model, searchObj, next) {
    Model.findOne(searchObj, function(err, url) {
      next(self, url);   
    });
  }

};

module.exports = DbHelper;