var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/foot/:page', function(req, res, next) {
    res.sendFile('footer.json', {
        root: './'
      });
});

module.exports = router;
