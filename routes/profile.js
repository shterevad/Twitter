var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('profile.htm', {
    root: './public/js/profile'
  });
});

module.exports = router;
