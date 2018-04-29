var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var session = require('express-session');
const MONGO_URL = 'mongodb://shterevad:Spaghett1@ds249079.mlab.com:49079/twitterittalents';


// var monk = require('monk');
// var db = monk(MONGO_URL);

//connect mongoose
mongoose.connect(MONGO_URL);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var postsRouter = require('./routes/posts');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'BirdsOfAFeather',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000000 }
}))

app.use(function (req, res, next) {
    req.db = db;
    next();
  });

function checkLogin(req, res, next){
  // console.log(req.session);
  if((req.session) && (req.session.user)){
    next();
  } else {
    // res.json({status: 'not authorized'})
    // res.status(401);
    res.redirect('/login');
  }
}

app.use('/login', loginRouter);
app.use('/', checkLogin, indexRouter);
app.use('/posts', checkLogin, postsRouter);
app.use('/logout', checkLogin, function(req, res, next){
  req.session.destroy();
  res.redirect('/login');
})


module.exports = app;
