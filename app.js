var express = require('express');
var path = require('path');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('hbs');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const { ensureAuthenticated } = require('./config/auth');

// Favicon handler
var favicon = require('serve-favicon');

// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recipesRouter = require('./routes/recipes');
var categoriesRouter = require('./routes/categories');

var app = express();

require('./config/passport')(passport);

handlebars.registerHelper('listItem', function (from, to, context, options) {
  var item = "";
  for (var i = from, j = to; i < j; i++) {
    item = item + options.fn(context[i]);
  }
  return item;
});

handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

handlebars.registerHelper('toUpperCase', function(str) {
  return str.toUpperCase();
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

// Allow express to use json in requests and responses
// Extended true - we might want to use more complex forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});



app.use(cookieParser());

// Path to serve static files

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recipes', ensureAuthenticated, recipesRouter);
app.use('/categories', categoriesRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
