var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const MAX_LENGTH_TEXT = 230;
var PostSchema = new Schema({

   text: {
    type: String,
    maxlength: MAX_LENGTH_TEXT
  },
  retweetText:{
    type:String,
    maxlength: MAX_LENGTH_TEXT
  },
  _userId: {
    type: Schema.Types.ObjectId,
  },
  userUsername:String,
  userName: String,
  photo: String,
  tags: [String],
  links: [String],
  videos: [String],
  giffs: [String],
  likes: [Schema.Types.ObjectId],
  retweets: [Schema.Types.Object],
  replies: [],
  posted: {
    type: Date,
    default: Date.now
  },
  profilePicture:String
});

module.exports = mongoose.model('Posts', PostSchema);