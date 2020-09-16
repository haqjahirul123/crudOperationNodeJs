const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('req-flash');
const cors = require('cors')


const indexRouter = require('./routes/index');
const boatsRouter = require('./routes/boats');

const app = express();

app.use(cors())
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Connection 

/*mongoose.connect("mongodb://localhost/:27017/mycrud",{
  useNewUrlParser: true
})
.then(() => console.log("Mongo DB Connected"))
.catch(err => console.log(err));

*/

//mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true });
//State  0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
//console.log(mongoose.connection.readyState);


app.use(session({
  secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
  resave: false,
  saveUninitialized: true
  }));

  app.use(flash());
 
 // Global constiables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//Db Connection Start 
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })
.then(() => console.log('connection succesful'))
.catch((err) => console.error(err))

//DB Connection End

 
app.use('/uploads',express.static('uploads'))
app.use('/index', indexRouter);
app.use('/', boatsRouter);
 


 





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
