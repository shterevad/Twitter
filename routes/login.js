var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var Users = require("../modules/users.js")

const PASSWORD_MIN_LENGTH = 6;
const OK_STATUS = 200;
const INVALID_CREDENTIALS_STATUS = 401;
const ALREADY_EXISTS_STATUS = 403;
const DOESNT_EXISTS_STATUS = 404;

// GET login page.
router.get('/', function (req, res, next) {
  res.sendFile('login.html', {
    root: './public'
  });
});

// SIGN UP USER
router.post('/signup', function(req, res, next){
  // res.setHeader('content-type', 'application/json');
  Users.findOne({ "email": req.body.email }, {}, function (err, doc) {
    if (doc) {
      res.status(ALREADY_EXISTS_STATUS).json({ error: "User with this email already exists"});
    } else {
      if((req.body.name.trim().length > 0) && (req.body.password.trim().length >= PASSWORD_MIN_LENGTH) 
      && (req.body.email.trim().length > 0)){
          var newUser = new Users(req.body);
          newUser.password = sha1(newUser.password);
          Users.create(newUser, function(err, re){
          if(err) throw err;
          res.status(OK_STATUS).json({ message: "A new user has been added successfully."});
        })
      }
    }
  });
});

// CHECK USER
router.post('/login', function (req, res, next) {
  res.setHeader('content-type', 'application/json');
  var foundUser;

  Users.findOne({$or:[{$and:[{"email" : req.body.name}]},{$and:[{"username" : req.body.name}]}]}, {}, function(err, user){
    if(!user){
      res.status(DOESNT_EXISTS_STATUS).json({error: "User doesn't exist"})
    } else {
      if((sha1(req.body.password) === user.password) && ((req.body.name === user.username) || (req.body.name === user.email))){
        req.session.user = user._id;
        res.status(OK_STATUS).json({user});
      } else {
        res.status(INVALID_CREDENTIALS_STATUS).json({error: "Invalid credentials"})
      }
    }
  });

});


module.exports = router;
