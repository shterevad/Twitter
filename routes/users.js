var express = require('express');
var session = require('express-session');
var router = express.Router();
var Users = require("../modules/users.js");

// const NAME_MIN_LENGTH = 2;
// const NAME_MAX_LENGTH = 15;
// const PASSWORD_MIN_LENGTH = 6;
const OK_STATUS = 200;
const DOESNT_EXISTS_STATUS = 404;
const INVALID_CREDENTIALS_STATUS = 401;
const INVALID_PARAMS_STATUS = 406;


router.get('/id/:id', function(req, res, next){
  res.setHeader('content-type', 'application/json');
  var idToCheck = req.params.id;
  if(!Object.keys(idToCheck).length == 0){
    Users.findById(idToCheck, function(err, user){
        if(user){
          res.status(OK_STATUS).json({user: user});
        } else {
          res.status(DOESNT_EXISTS_STATUS).send({error: "User with this ID doesn't exist"});
        }
    })
  } else {
      res.status(INVALID_CREDENTIALS_STATUS).send({error: "Invalid ID"});
  }
});

router.get('/session', function(req, res, next){
    res.setHeader('content-type', 'application/json');
    if(req.session.user){
        res.status(OK_STATUS).json({user : req.session.user})
    } else {
        res.status(DOESNT_EXISTS_STATUS).send({error: "There is no user in session"});
    }
})

module.exports = router;
