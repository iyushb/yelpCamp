var express = require('express');
var router = express.Router();

var campground = require('../models/campgrounds');
const middleware = require('../middleware/index');

//index route
router.get('/', function (req, res) {
    campground.find({}, (err, allcampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/campgrounds', {
                campgrounds: allcampgrounds,
            });
        }
    });
});

//Campground Create route
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/addcamp');
});

router.post('/', middleware.isLoggedIn, function (req, res) {
    var img_name = req.body.img_name;
    var img_url = req.body.img_url;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampgrounds = {
        name: img_name,
        image: img_url,
        description: desc,
        author: author
    };
    campground.create(newCampgrounds, (err, newCampgrounds) => {
        res.redirect('/campgrounds');
        console.log('===Campground created===' + newCampgrounds);
    });
});

//show route
router.get('/:id', function (req, res) {
    campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log("....from show route" + foundCampground);
            res.render('campgrounds/show', {
                campground: foundCampground
            });
        }
    })
});

//update route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
    campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log('update route' + err);
        } else {
            res.render('campgrounds/edit', {
                campground: foundCampground
            });
        }
    });
});


router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    campground.findByIdAndUpdate(req.params.id, req.body.camp, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//Delete Route
router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    campground.findByIdAndRemove({
        _id: req.params.id
    }, function (err, campground) {
        if (err) {
            console.log('error deleting campground' + err);
        } else {
            res.redirect('/campgrounds');
        }
    })
});

module.exports = router;
