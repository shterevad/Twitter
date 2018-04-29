var express = require('express');
var router = express.Router();
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
      res.json({ error: "User with this email already exists", status: 403 });
    } else {
      if((req.body.name.trim().length > 0) && (req.body.password.trim().length >= 6) 
      && (req.body.email.trim().length > 0)){
          var newUser = new Users(req.body);
          Users.create(newUser, function(err, re){
          if(err) throw err;
          res.json({ message: "A new user has been added successfully.", status: 200 });
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
      res.json({
        error: "User doesn't exist",
        status: 404
      });
    } else {
      if((req.body.password === user.password) && ((req.body.name === user.username) || (req.body.name === user.email))){
        req.session.user = user._id;
        console.log(req.session)
        res.json({
          message: user._id,
          status: 200
        });
      } else {
        res.json({
          error: "Invalid credentials",
          status: 401
        })
      }
    }
  });

  // if(req.body.name.search('@') < 0){
  //   Users.findOne({ "name" : req.body.name}, {}, function(err, user){
  //     foundUser = Object.create(user); 
  //   });
  // } else {
  //   Users.findOne({ "email" : req.body.name}, {}, function(err, user){
  //     foundUser = Object.create(user);
  //   });
  // }

  

  // Users.findOne({ "name": req.body.name }, {}, function (err, doc) {
  //   if ((req.body.name == doc.name) && (req.body.password == doc.pass)) {
  //     res.status(200);
  //     res.json({ message: "Success" });
  //   } else {
  //     res.status(403);
  //     res.json({ error: "Incorrect credentials" });
  //   }
  // });
});


module.exports = router;
