var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var bcrypt = require('bcrypt');

var username = "cmps369";
var password = "finalproject";
bcrypt.genSalt(10, function(err, salt){
  bcrypt.hash(password, salt, function(err, hash){
    password = hash;
    console.log("Hashed password = " + password);
  });
});

var index = require('./routes/index');
var users = require('./routes/users');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017", {useMongoClient: true});

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = path.join(__dirname, "views");
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'cmps369'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },

  function(user, pswd, done) {
    if (user != username) {
      console.log("Invalid username");
      return done (null, false);
    }

    bcrypt.compare(pswd, password, function (err, isMatch) {
      if (err) return done (err);
      if ( !isMatch) {
        console.log("Invalid password");
      } else {
        console.log("Valid Password");
      }
      done(null, isMatch);
    });
  }
));

passport.serializeUser(function(username, done) {
  done(null, username);
});

passport.deserializeUser(function(username, done) {
  done(null, username);
});

routes.post("/login", passport.authenticate('local', {
  successRedirect: "/contacts",
  failureRedirect: "/login"
}));

routes.get("/login", function(req, res) {
  res.render("login", {});
});

routes.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/login");
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
