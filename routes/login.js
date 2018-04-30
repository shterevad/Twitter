var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var Users = require("../modules/users.js")

// GET login page.
router.get('/', function (req, res, next) {
  res.sendFile('login.html', {
    root: './public'
  });
});

// SIGN UP USER
router.post('/signup', function(req, res, next){
  res.setHeader('content-type', 'application/json');
  Users.findOne({ "email": req.body.email }, {}, function (err, doc) {
    if (doc) {
      res.status(403).json({ error: "User with this email already exists", status: 403 });
    } else {
      if((req.body.name.trim().length > 0) && (req.body.password.trim().length >= 6) 
      && (req.body.email.trim().length > 0)){
          var newUser = new Users(req.body);
          newUser.password = sha1(newUser.password);
          Users.create(newUser, function(err, re){
          if(err) throw err;
          res.status(200).json({ message: "A new user has been added successfully.", status: 200 });
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
      res.status(404).json({
        error: "User doesn't exist",
        status: 404
      })
    } else {
      if((sha1(req.body.password) === user.password) && ((req.body.name === user.username) || (req.body.name === user.email))){
        req.session.user = user._id;
        res.status(200).json({
          message: user._id,
          status: 200
        });
        res.status = 200;
      } else {
        res.status(401).json({
          error: "Invalid credentials",
          status: 401
        })
      }
    }
  });

});


module.exports = router;
