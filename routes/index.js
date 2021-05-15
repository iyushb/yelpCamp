var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', function (req, res) {
    res.render('index');
});

// SignUp routes
router.get('/signup', function (req, res) {
    res.render('authenticate/signup')
});

router.post('/signup', function (req, res) {
    User.register(new User({
        username: req.body.username
    }), req.body.password, function (err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.render('authenticate/signup');
        }
        passport.authenticate('local')(req, res, function () {
            req.flash('success', "Registration Sucessful");
            res.redirect('/campgrounds');
        });
    });
});

//login routes
router.get('/login', function (req, res) {
    if (req.query.origin) {
        req.session.returnTo = req.query.origin;
    } else {
        req.session.returnTo = req.header('Referer')
    }

    res.render('authenticate/login');
});

router.post('/login', passport.authenticate('local', {
    // successRedirect: '/campgrounds',
    failureRedirect: "/login"
}), function (req, res) {
    let returnTo = '/'
    if (req.session.returnTo) {
        returnTo = req.session.returnTo
        delete req.session.returnTo
    }
    req.flash('success', 'Sucessfully Logged In');
    console.log('signed in as' + req.user);
    res.redirect(returnTo);
});

//logout routes
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'Sucessfully Logged Out');
    res.redirect('/campgrounds');
});

module.exports = router;
