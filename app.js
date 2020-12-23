var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');

var app = express();
mongoose.connect('mongodb://localhost:27017/bank-server2')

app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:"secretkey",
  resave: false,
  saveUninitialized: true
}));

function logMiddleware(req,res,next){
  console.log("logMiddleware");
  console.log(req.body);
  next();
}

app.use(logMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  res.status(err.status||500).send({ message:err.message});
});

module.exports = app;