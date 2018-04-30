var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const MAX_LENGTH_TITLE = 100;
var TagsSchema = new Schema({

   title: String,
  posts: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Tags', TagsSchema);