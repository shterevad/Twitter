var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
  res.sendFile('login.html', {
    root: './public'
  });
  // var users = req.db.get("users");  
  // users.find({}, {}, function(err, users){
  //   res.json(users);
  // });
});

router.post('/login', function (req, res, next) {
  res.setHeader('content-type', 'application/json');
  var users = req.db.get("users");  
  var userToCheck = req.body;
  users.find({ name: req.body.name }, {}, function (e, docs) {
    if ((req.body.name == 'pesho') && (req.body.password == '1234567')) {
      res.status(200);
      res.json({ message: "bravo" });
    } else {
      res.status(403);
      res.json({ error: "Ti ne si Pesho, ae chao!" });
    }
  });
});


module.exports = router;
