const campground = require("../models/campgrounds");
const comment = require("../models/comments");

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Unauthorized User');
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    }
}

// Comment ownership
middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                req.redirect('back');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Unauthorized User');
                    res.redirect('back');
                }
            }
        });
    }
}
//isLoggedIn middleware
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', "Please log In First");
        res.redirect(`/login?origin=${req.originalUrl}`);
    }
}

module.exports = middlewareObj;