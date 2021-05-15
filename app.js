var express = require('express');
const app = express();

// var seedDB = require('./seeds');
// seedDB();
var methodOverride = require('method-override');
var mongoose = require('mongoose');

var campground = require('./models/campgrounds.js');
var comment = require('./models/comments.js');
const User = require('./models/user.js');

const flash = require('connect-flash');
app.use(flash());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");

app.use(express.static('public'));

var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');


mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB Connected')
}).catch(err => {
    console.log("Database Connection Error :" + err.message)
});
//=============passport configuration===================
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

app.use(require('express-session')({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//===================For having req.user in every route as currentUser==========================
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});
//==============================================================================================
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

//===============method-overide=================================================================



app.listen(3000, function () {
    console.log('server started at - localhost:3000');
})