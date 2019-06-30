const express = require('express');
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const handlebars = require('hbs');
const fs = require('fs');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const pgSession = require('connect-pg-simple')(session);
const favicon = require('serve-favicon');

const { ensureAuthenticated } = require('./config/auth');
const pgClient = require('./db/pg-controller');
// Favicon handler

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');

const apiRecipesRouter = require('./routes/api/recipes');
const apiUsersRouter = require('./routes/api/users');
const apiCategoriesRouter = require('./routes/api/categories');
const apiUnitsRouter = require('./routes/api/units');

var app = express();

require('./config/passport')(passport);

handlebars.registerHelper('listItem', function (from, to, context, options) {
  var item = "";
  for (var i = from, j = to; i < j; i++) {
    item = item + options.fn(context[i]);
  }
  return item;
});

handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

handlebars.registerHelper('toUpperCase', function (str) {
  return str.toUpperCase();
});

handlebars.registerPartials(__dirname.concat('/views/partials'));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

// Allow express to use json in requests and responses
// Extended true - we might want to use more complex forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new pgSession({
    pool: pgClient,                // Connection pool
    tableName: 'user_session'   // Use another table-name than the default "session" one
  }),
  secret: process.env.FOO_COOKIE_SECRET,
  resave: true,
  secret: 'secret',
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  if (req.user){
    res.locals.userEmail = req.user["email_address"];
    res.locals.userNickname = req.user["nickname"];
  }
  next();
});

app.use(cookieParser());

// Path to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', ensureAuthenticated, usersRouter);
app.use('/recipes', ensureAuthenticated, recipesRouter);

app.use('/api/recipes', apiRecipesRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/categories', apiCategoriesRouter);
app.use('/api/units', apiUnitsRouter);

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
