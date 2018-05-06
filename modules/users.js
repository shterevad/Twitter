var mongoose = require("mongoose");
var random = require('mongoose-simple-random');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;

const MIN_LENGTH_NAME = 2;
const MAX_LENGTH_NAME = 20;
const EMAIL_VALIDATION = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

var UserSchema = new Schema({
    active: {
      type: Boolean,
      default: true
    },
    name: { 
      type: String, 
      minlength: MIN_LENGTH_NAME, 
      maxlength: MAX_LENGTH_NAME 
    },
    username: { 
      type: String, 
      minlength: MIN_LENGTH_NAME, 
      maxlength: MAX_LENGTH_NAME,
      unique: true,
      required: true
    },
    email: { 
      type: String, 
      validate: {
        validator: function(v) {
          return EMAIL_VALIDATION.test(v);
        },
        message: 'Not a valid email!',
        status: 401
      },
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    registered: { 
      type: Date,
      default: Date.now
    },
    description: String,
    location: String,
    website: String,
    birthdate: Date,
    profilePicture: {
      type: String,
      default: "images/default/default_profile_icon.png"
    },
    headerPicture: {
      type: String,
      default: "images/default/default_header_image.png"
    },
    posts: [],
    followers: [],
    following: [],
    gallery: [String],
    likes: [],
    conversations:[{_userId: Object, messages:[String]}]
  });


UserSchema.plugin(random);
module.exports = mongoose.model('Users', UserSchema);