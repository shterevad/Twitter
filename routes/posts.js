var express = require('express');
var router = express.Router();
var Posts = require("../modules/posts.js")

/* get all posts */
router.get("/", function (req, res) {
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

/* add new post */
router.post('/', function (req, res) {
    var posts = req.db.get('posts');
    var post = req.body;
    //todo: validation

    posts.insert(post, function (err) {
        if (!err) {
            res.status(200);
            res.json({post:post});
        } else {
            res.status(404);
            res.json("No such post!");
        }

    });
});

/* delete post by id */
router.delete('/:id', function (req, res) {
    var posts = req.db.get('posts');
    var id = req.params.id;

    posts.remove({ _id: id }, function (err) {
        if (!err) {
            res.status(200);
            res.json("Post has been removed!");
        } else {
            res.status(404);
            res.json("No such post!");
        }
    });
});





module.exports = router;