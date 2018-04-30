var express = require('express');
var router = express.Router();
var Users = require("../modules/users.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('home.htm', {
    root: './public/js/home'
  });
});

module.exports = router;
