var express = require('express');
var router = express.Router();

// GET login page.
router.get('/', function (req, res, next) {
  res.sendFile('login.html', {
    root: './public'
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
