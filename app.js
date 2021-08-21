var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var fileUpload = require('express-fileupload');

require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/admin/login');
var adminRouter = require('./routes/admin/administrador');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ //aca es donde vamos a usar esa var 'session'
  secret: 'SuperClaveSecreta420',
  resave: false,
  saveUninitialized: true
}));

app.use(fileUpload({
  useTempFiles:true,
  tempFileDir: '/tmp/'
}));

secured = async(req, res, next) => {
  try{
    if (req.session.id_usuario){
      next();
    }else{
      res.redirect('/admin/login')
    }
  }catch(error){
    console.log(error);
  }
}

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/login', loginRouter);
app.use('/admin/administrador', secured, adminRouter);

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

module.exports = app;
