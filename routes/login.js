var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('loginPage.htm', {
    root: './public/js/login'
  });
});

module.exports = router;
