var mongoose = require("mongoose");
var random = require('mongoose-simple-random');
var Schema = mongoose.Schema;
const MAX_LENGTH_TITLE = 100;
var TagsSchema = new Schema({
   title: {
       type:String,
   },
  posts: [],

});

TagsSchema.plugin(random);

module.exports = mongoose.model('Tags', TagsSchema);