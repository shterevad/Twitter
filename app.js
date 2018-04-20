var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('mongodb');
var monk = require('monk');
const MONGO_URL = 'mongodb://<shterevad>:<Spaghett1>@ds249079.mlab.com:49079/twitterittalents';
var db = monk(MONGO_URL);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    req.db = db;
  
    next();
  });

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
