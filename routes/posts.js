var express = require('express');
var router = express.Router();
var Posts = require("../modules/posts.js");

const OK_STATUS = 200;
const DOESNT_EXISTS_STATUS = 404;
const BAD_REQUEST = 400;


//get post by id
router.get("/:id", function (req, res) {
    Posts.findOne({ _id: req.params.id }, {}, function (err, post) {
        if (!err) {
            res.status(OK_STATUS).json(post);
        } else {
            res.status(DOESNT_EXISTS_STATUS).send({ error: "Cannot find post with this ID!" });
        }
    });
});

//get users posts 
router.get("/posts/:userId", function (req, res) {
    Posts.find({ _userId: req.params.userId }, {}, function (err, posts) {
        if (!err) {
            res.status(OK_STATUS).json(posts);
        } else {
            res.status(DOESNT_EXISTS_STATUS).send({ error: "Cannot find post with this userID!" });
        }
    });
})


//update post fields
router.post('/post/update', function (req, res) {
    Posts.update({ _id: req.body.post._id }, req.body.post, function(err, p){
        if(!err){
            res.status(OK_STATUS).json(p);
        } else {
            res.status(INVALID_PARAMS_STATUS).json(err)
        }
    }) 
})


//add  new post 
router.post('/newpost', function (req, res) {
    var post = req.body.post;
        Posts.create(post, function (err, post) {
            if (!err) {
                res.status(OK_STATUS).json(post);
            } else {
                res.status(BAD_REQUEST).send({ error: "Post did not match the request syntax!" });
            }
        });
    
});


/* delete post by id */
router.delete('/posts/:id', function (req, res) {
    Posts.findByIdAndRemove(req.params.id, function (err, post) {
        if (!err) {
            res.status(OK_STATUS).json(post);
        } else {
            res.status(DOESNT_EXISTS_STATUS).send({ error: "Cannot find post with this ID!" });
        }
    });
});


// get all posts 
router.get("/posts", function (req, res) {
    Posts.find({}, {}, function (err, posts) {
        if (!err) {
            res.status(OK_STATUS).json(posts);
        }
    });
});

module.exports = router;