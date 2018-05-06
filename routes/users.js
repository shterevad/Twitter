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

//get user user by id
router.get('/id/:id', function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    var idToCheck = req.params.id;
    if (!Object.keys(idToCheck).length == 0) {
        Users.findById(idToCheck, function (err, user) {
            if (user) {
                res.status(OK_STATUS).json({ user: user });
            } else {
                res.status(DOESNT_EXISTS_STATUS).send({ error: "User with this ID doesn't exist" });
            }
        })
    } else {
        res.status(INVALID_CREDENTIALS_STATUS).send({ error: "Invalid ID" });
    }
});

//get user by username
router.get('/username/:username', function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    var usernameToCheck = req.params.username;
    if (!Object.keys(usernameToCheck).length == 0) {
        Users.findOne({"username" : usernameToCheck}, function (err, user) {
            if (user) {
                res.status(OK_STATUS).json({ user: user });
            } else {
                res.status(DOESNT_EXISTS_STATUS).send({ error: "User with this ID doesn't exist" });
            }
        })
    } else {
        res.status(INVALID_CREDENTIALS_STATUS).send({ error: "Invalid ID" });
    }
});

//get user in cookie session
router.get('/session', function (req, res, next) {
    if (req.session.user) {
        res.status(OK_STATUS).json({ user: req.session.user })
    } else {
        res.status(DOESNT_EXISTS_STATUS).send({ error: "There is no user in session" });
    }
})

//add new post
router.post('/post', function (req, res, next) {
    userId = req.body.userId;
    post = req.body.post;
    Users.findOne({ "_id": userId }, function (err, user) {
        if (user) {
            let posts = user.posts;
            posts.push(post);
            user.save();
            res.status(200);
            res.json(user);
        } else {
            res.status(404);
            res.json(err);
        }
    });
});

//update user fields
router.post('/user', function (req, res) {
    var user = req.body.user;
    Users.findOne({"_id":user._id}, {}, function(err, u){
        if(!err){
            for (var field in Users.schema.paths) {
                if ((field !== '_id') && (field !== '__v')) {
                   if (req.body.user[field] !== undefined) {
                      u[field] = req.body.user[field];
                   }  
                }  
             }  
             u.save();
             res.json(u);
        }else{
            res.json(err);
        }
    });
});

// Random users, Who to follow list
router.get("/randomusers", function (req, res) {
    Users.findRandom({}, {}, { limit: 10 }, function (err, results) {
        if (!err) {
            res.json(results);
        }
    });
});

//get all users
router.get("/users", function (req, res) {
    Users.find({}, {}, function (err, results) {
        if (!err) {
            res.json(results);
        }
    });
});

router.get("/following/:userId", function (req, res) {
        Users.findOne({ _id: req.params.userId }, {}, function (err, results) {
            if (!err) {
                res.json(results);
            }
        });
});

//follow user by id
router.post('/follow', function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    toFollowId = req.body.toFollowId;
    followerId = req.body.followerId;

    Users.findOne({ "_id": followerId }, function (err, user) {
        if (user.following.indexOf(toFollowId) < 0) {
            user.following.push(toFollowId);
            user.save(function (err) {
                if (err) {
                    console.log(err)
                };
            })
        } else {
            res.status(INVALID_PARAMS_STATUS).send({ message: "Already followed" });
            console.log("User alreay followed");
        }
    })

    Users.findOne({ "_id": toFollowId }, function (err, user) {
        if (user.followers.indexOf(followerId) < 0) {
            user.followers.push(followerId);
            user.save(function (err) {
                if (err) {
                    console.log(err)
                };
            })
        } else {
            res.status(INVALID_PARAMS_STATUS).send({ messate: "Already followed" });
            console.log("User alreay followed");
        }
    })
    res.status(OK_STATUS).send({ message: "Success" })
})

//unfollow user by id
router.post('/unfollow', function (req, res, next) {
    res.setHeader('content-type', 'application/json');
    toUnfollowId = req.body.toUnfollowId;
    followerId = req.body.followerId;

    Users.findOne({ "_id": followerId }, function (err, user) {
        let indexToDelete = user.following.indexOf(toUnfollowId);
        if (indexToDelete >= 0) {
            user.following.splice(indexToDelete, 1);
            user.save(function (err) {
                if (err) {
                    console.log(err)
                };
            })
        } else {
            res.status(INVALID_PARAMS_STATUS).send({ messate: "Not following" });
            console.log("User not followed");
        }
    })

    Users.findOne({ "_id": toUnfollowId }, function (err, user) {
        let indexToDelete = user.followers.indexOf(followerId);
        if (indexToDelete >= 0) {
            user.followers.splice(indexToDelete, 1);
            user.save(function (err) {
                if (err) {
                    console.log(err)
                    res.status(DOESNT_EXISTS_STATUS).send(err);
                };
            })
        } else {
            res.status(INVALID_PARAMS_STATUS).send({ messate: "Not following" });
            console.log("User not followed");
        }
    })
    res.status(OK_STATUS).send({ message: "Success" })
})

module.exports = router;
