var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  var usersCollection = req.db.get('users');
  console.log(usersCollection)
  usersCollection.find({}, {}, function (err, docs) {
    if (err) {
      res.status(500);
      res.json(err);
    } else {
      res.status(200);
      res.json(docs);
    }
    console.log(res.status);
  })
});

module.exports = router;
