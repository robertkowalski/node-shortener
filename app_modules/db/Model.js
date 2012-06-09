var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Url = new Schema({
  id: Number,
  shorturl: { type: String, index: true },
  url: String,
  date: Date
});

var Url = mongoose.model('Url', Url);

module.exports = Url;