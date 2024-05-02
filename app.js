var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./src/routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

var updateStreakUser = require("./src/schedule/updateStreakUser");
var sendNotification = require("./src/schedule/sendNotification");
var schedule = require("node-schedule");
var moment = require("moment-timezone");

moment.tz.setDefault("America/Sao_Paulo");

const rule = new schedule.RecurrenceRule();
// rule.hour = 6;
// rule.minute = 0;

const job = schedule.scheduleJob(rule, updateStreakUser);

const rule2 = new schedule.RecurrenceRule();
// rule2.hour = 19;
// rule2.minute = 0;

const job2 = schedule.scheduleJob(rule2, sendNotification);

module.exports = app;
