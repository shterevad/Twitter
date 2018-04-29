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
  // var users = req.db.get("users");
  console.log(Users);
  Users.findOne({ "email": req.body.email }, {}, function (err, doc) {
    if (doc) {
      res.json({ error: "User with this email already exists", status: 403 });
    } else {
      if((req.body.name.trim().length > 0) && (req.body.password.trim().length >= 6) 
      && (req.body.email.trim().length > 0)){
        // req.db.collection("users").insert(req.body, function(err, re){
          Users.create(req.body, function(err, re){
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
  var users = req.db.get("users");
  users.findOne({ "name": req.body.name }, {}, function (err, doc) {
    if ((req.body.name == doc.name) && (req.body.password == doc.pass)) {
      res.status(200);
      res.json({ message: "Success" });
    } else {
      res.status(403);
      res.json({ error: "Incorrect credentials" });
    }
  });
});


module.exports = router;
