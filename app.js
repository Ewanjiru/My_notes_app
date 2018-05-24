const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express()//initialize application

//Load routes
const notes = require('./routes/notes');
const users = require('./routes/users');

//passport config
require('./config/passport')(passport);

//database config
const database = require('./config/database');


//connect to mongoose
mongoose.connect(database.mongoURI)
  .then(() => {
    console.log('Mongodb connected....');
  })
  .catch(err => console.log(err))

//handlebars middlewares
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//method override middleware
app.use(methodOverride('_method'));

//express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

//index route
app.get('/', (req, res) => {
  res.render('index');
});

//index about
app.get('/about', (req, res) => {
  res.render('about');
});

//use routes
app.use('/notes', notes);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on Port ${port}`)
})
