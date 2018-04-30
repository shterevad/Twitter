var express = require('express');
var router = express.Router();
var Tags = require("../modules/tags.js")

/* get all posts */
router.get("/tags", function (req, res) {

    Tags.find({}, {}, function (err, tags) {
        if (!err) {
            res.status(200);
            res.json(tags);
        } else {
            res.status(404);
            res.json("There are no tags yet");
        }

    });
});

/* add new post */
router.post('/tags', function (req, res) {

    var tag = req.body;

    Tags.findOne({ "title": tag.title }, {}, function (err, t) {
        if (!t) {
            Tags.create(tag, function (err, tag) {
                if (!err) {
                    res.status(200);
                    res.json({ tagId: tag._id });
                } else {
                    res.status(404);
                    res.json(err);
                }
            });
        } else {
            let posts = t.posts;
            posts.push(tag.posts[0]);
            return t.save();

        }
    });
    //todo: validation 
    /*  Tags.create(tag, function (err, doc) {
         if (!err) {
             res.status(200);
             res.json({tag:tag});
         } else {
             res.status(404);
             res.json(err);
 }}); */
});

/* delete post by id */
router.delete('/tags:id', function (req, res) {
    var id = req.params.id;

    Tags.remove({ _id: id }, function (err) {
        if (!err) {
            res.status(200);
            res.json({ id: tag._id });
        } else {
            res.status(404);
            res.json("No such post!");
        }
    });
});


module.exports = router;