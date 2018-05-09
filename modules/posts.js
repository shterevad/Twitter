var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const MAX_LENGTH = 230;
const MIN_LENGTH = 2;

var PostSchema = new Schema({

  text: {
    type: String,
    maxlength: MAX_LENGTH
  },

  retweetText: {
    type: String,
    maxlength: MAX_LENGTH
  },
  _userId: {
    type: Schema.Types.ObjectId,
    required:true,
  },

  userUsername: String,
  userName: String,
  photo: String,
  tags: [String],
  links: [String],
  videos: [String],
  likes: [Schema.Types.ObjectId],
  liked: Boolean,
  retweets: [Schema.Types.Object],
  retweetText:String,
  replies: [],
  posted: {
    type: Date,
    default: Date.now
  },
  profilePicture: String
});

module.exports = mongoose.model('Posts', PostSchema);