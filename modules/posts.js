var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    text: String,
    user: String
  });

module.exports = mongoose.model('Posts', PostSchema);