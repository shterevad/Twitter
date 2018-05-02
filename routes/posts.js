var express = require('express');
var router = express.Router();
var Posts = require("../modules/posts.js")

/* get all posts */
router.get("/posts", function (req, res) {
    // var posts = req.db.get('posts'); => Posts заменя този ред. Директно пишеш Posts.find долу 
    //(само не съм сигурна дали е find за mongoose, малко им се разминават някои функции, например няма insert, ами create);

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


//get users posts 
router.get("/posts/:userId", function(req, res){
    Posts.find({_userId: req.params.userId}, {}, function (err, posts) {
        if (!err) {
            res.status(200);
            res.json(posts);
        } else {
            res.status(404);
            res.json("There are no posts yet");
        }
    });
})

/* add new post */
router.post('/posts', function (req, res) {
    var post = req.body;
    //todo: validation
        Posts.create(post, function (err, doc) {
            if (!err) {
                res.status(200);
                res.json({post:doc});
            } else {
                res.status(404);
                res.json(err);
    }});
});

/* delete post by id */
router.delete('/posts:id', function (req, res) {
    var id = req.params.id;

    Posts.remove({ _id: id }, function (err) {
        if (!err) {
            res.status(200);
            res.json({id:post._id});
        } else {
            res.status(404);
            res.json("No such post!");
        }
    });
});


module.exports = router;