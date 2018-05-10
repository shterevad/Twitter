var mongoose = require("mongoose");
var random = require('mongoose-simple-random');
var Schema = mongoose.Schema;

const MAX_LENGTH = 100;
const MIN_LENGTH = 2;

var TagsSchema = new Schema({
    title: {
        type: String,
        minlength: MIN_LENGTH,
        maxlength: MAX_LENGTH,
    },
    posts: [String],

});

TagsSchema.plugin(random);

module.exports = mongoose.model('Tags', TagsSchema);