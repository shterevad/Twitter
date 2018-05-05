var express = require('express');
var router = express.Router();
var Posts = require("../modules/posts.js")

/* get all posts */
router.get("/posts", function (req, res) {
    Posts.find({}, {}, function (err, posts) {
        if (!err) {
            res.status(200);
            res.json(posts);
        } else {
            res.status(404);
            res.json("There are no posts yet");
        }

    });
});

//get post by id
router.get("/:id", function (req, res) {
    Posts.findOne({ _id: req.params.id }, {}, function (err, post) {
        if (!err) {
            res.status(200);
            res.json(post);
        } else {
            res.status(404);
            res.json("There are no posts yet");
        }

    });
});


//get users posts 
router.get("/posts/:userId", function (req, res) {
    Posts.find({ _userId: req.params.userId }, {}, function (err, posts) {
        if (!err) {
            res.status(200);
            res.json(posts);
        } else {
            res.status(404);
            res.json("There are no posts yet");
        }
    });
})


router.post('/post/update', function (req, res) {
    var post = req.body.post;
    Posts.findOne({ _id: post._id }, {}, function (err, p) {
        if (p) {
            for (var field in Posts.schema.paths) {
                if ((field !== '_id') && (field !== '__v')) {
                    if (req.body.post[field] !== undefined) {
                        p[field] = req.body.post[field];
                    }
                }
            }
            p.save();
            res.json(p);
        } else {
            res.status(404);
            res.json("No such post!");
        }
});
})


//add  new post 
router.post('/newpost', function (req, res) {
    var post = req.body.post;
    Posts.create(post, function (err, post) {
        if (!err) {
            res.status(200);
            console.log(post);
            res.json({ post: post });
        } else {
            res.status(404);
            res.json(err);
        }
    });
});


/* delete post by id */
router.delete('/posts/:id', function (req, res) {
    var id = req.params.id;

    Posts.remove({ _id: id }, function (err, post) {
        if (!err) {
            res.status(200);
            res.json({ id: post._id });
        } else {
            res.status(404);
            res.json("No such post!");
        }
    });
});


module.exports = router;