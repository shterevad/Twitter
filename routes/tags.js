var express = require('express');
var router = express.Router();
var Tags = require("../modules/tags.js")

/* get 10 random tags */
router.get("/randomtags", function (req, res) {
    Tags.findRandom({}, {}, { limit: 10 }, function (err, results) {
        if (!err) {
            res.json(results);
        }
    });
});

//get tag by title
router.get("/tag/:title", function (req, res) {
    res.setHeader('content-type', 'application/json');
    Tags.findOne({ "title": req.params.title }, {}, function (err, tag) {
        if (!err) {
            res.status(200).json(tag);
        } else {
            res.status(402).json(err.data);
        }
    });
});


//get tag by id
router.get("/:id", function (req, res) {
    Tags.findOne({ "_id": req.params.id }, {}, function (err, tag) {
        if (!err) {
            res.status(200).json(tag);
        } else {
            res.status(402).json(err.data);
        }
    });
});



/* add or modify tag */
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
            posts.push(tag.posts);
            t.save();
        }
    });
});


router.post('/update', function (req, res) {

    Tags.findOne({ "title": req.body.title }, {}, function (err, t) {
        if (t) {
            for (var field in Tags.schema.paths) {
                if ((field !== '_id') && (field !== '__v')) {
                    if (req.body[field] !== undefined) {
                        t[field] = req.body[field];
                    }
                }
            }
            t.save();
            res.status("200");
            res.json(t);
        } else {
            res.status("404");
            res.json("No such tag!");
        }
    });
});

/* delete post by id */
router.delete('/tags/:id', function (req, res) {
    Tags.findByIdAndRemove(req.params.id, function (err,tag) {
        if (!err) {
            res.status(200);
            res.json(tag._id);
        } else {
            res.status(404);
            res.json("No such post!");
        }
    });
});


module.exports = router;