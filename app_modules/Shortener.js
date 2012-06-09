var Shortener = function() {
  this.codeset = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  this.base = this.codeset.length;

  this.value = '';
};

Shortener.prototype = {

  /**
   * @public
   * @param {Number}
   * @return {String} ShortUrl
   */
  encode: function(id) {
   var shortUrl = '';
   while (id > 0) {
     shortUrl = shortUrl + this.codeset[id%this.base];
     id = ~~(id/this.base);
   }

   this.value = shortUrl;
   return shortUrl;
  },

  /**
   * @public
   * @param {String}
   * @return {Number} id
   */
  decode: function(string) {
    var id = 0,
        i;

    for (i = string.length-1; i >= 0; i--) {
      id += (this.codeset.indexOf(string[i])) * Math.pow(this.base, i);
    }

    return Number(id);
  }
};

module.exports = Shortener;