var express = require('express');
var router = express.Router();
var Tags = require("../modules/tags.js");

const OK_STATUS = 200;
const DOESNT_EXISTS_STATUS = 404;

//get random tags
router.get("/randomtags", function (req, res) {
    Tags.findRandom({}, {}, { limit: 10 }, function (err, results) {
        if (!err) {
            res.status(OK_STATUS).json(results);
        }
    });
});

//get tag by title
router.get("/tag/:title", function (req, res) {
    Tags.findOne({ "title": req.params.title }, {}, function (err, tag) {
        if (!err) {
            res.status(OK_STATUS).json(tag);
        } else {
            res.status(DOESNT_EXISTS_STATUS).send({error:"Cannot find tag with this title!"});
        }
    });
});


//get tag by id
router.get("/:id", function (req, res) {
    Tags.findOne({ "_id": req.params.id }, {}, function (err, tag) {
        if (!err) {
            res.status(OK_STATUS).json(tag);
        } else {
            res.status(DOESNT_EXISTS_STATUS).send({error:"Cannot find tag with this ID!"});
        }
    });
});



//add or modify tag 
router.post('/tags', function (req, res) {
    var tag = req.body;
    Tags.findOne({ "title": tag.title }, {}, function (err, t) {
        if (!t) {
            Tags.create(tag, function (err, tag) {
                if (!err) {
                    res.status(OK_STATUS).json({ tagId: tag._id });
                } else {
                    res.status(DOESNT_EXISTS_STATUS).send({error:"Cannot find tag with this title!"});
                }
            });
        } else {
            let posts = t.posts;
            posts.push(tag.posts);
            t.save();
        }
    });
});


//update tag fields
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
            res.status(OK_STATUS).json(t);
        } else {
            res.status(DOESNT_EXISTS_STATUS).send({error:"Cannot find tag with this title!"});
        }
    });
});

// delete post by id 
router.delete('/tags/:id', function (req, res) {
    Tags.findByIdAndRemove(req.params.id, function (err,tag) {
        if (!err) {
            res.status(OK_STATUS).json(tag._id);
        } else {
            res.status(DOESNT_EXISTS_STATUS).send({error:"Cannot find tag with this ID!"});
        }
    });
});



module.exports = router;