var express = require('express');
var router = express.Router({
    mergeParams: true
});
var campground = require('../models/campgrounds.js')
var comment = require('../models/comments.js')
const middleware = require('../middleware/index');

router.get('/new', middleware.isLoggedIn, function (req, res) {
    campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {
                campground: foundCampground,
            });
        }
    })

});

router.post('/', function (req, res) {
    campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            comment.create(req.body.comment, function (err, createdComment) {
                if (err) {
                    console.log(err);
                } else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    req.flash('success', 'Comment successfully added');
                    res.redirect('/campgrounds/' + foundCampground._id);
                }
            });
        }
    })
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function (req, res) {
    comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log('--------Comment finding error-------' + err);
            res.redirect('back');
        } else {
            console.log('----comment found----' + foundComment);
            res.render('comments/edit', {
                comment: foundComment,
                campground_id: req.params.id
            })
        }
    })
});

router.put('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            console.log('---error Updating Comment' + err);
        } else {
            req.flash('sucess', 'Comment sucessfully updated');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

router.delete('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
    comment.findByIdAndRemove({
        _id: req.params.comment_id
    }, function (err, comment) {
        if (err) {
            console.log('error deleting the comment' + err);
        } else {
            req.flash('success', 'Comment successfully deleted ')
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});
module.exports = router;