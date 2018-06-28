const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport')
const config = require('./config/database')
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session')


mongoose.connect(config.database)

let db = mongoose.connection;

// Check connection

db.once('open', function() {
  console.log("Connected to MongoDB")
});

// Check for DB errors

db.on('error', function(err) {
  console.log("err")
});

// Initiate Express
const app = express();

// Set Public Folder for Static Files
app.use(express.static(path.join(__dirname, 'public')));


// BODY Parse required Middle ware ( code from github)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())

// Load View Engines
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(expressValidator());

// Session

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "secret"
  })
);


// Express Message Flash Middleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


require('./config/passport')(passport)


// Passport MiddleWare

app.use(passport.initialize());
app.use(passport.session());






// Create Global Variable User

app.get('*' , function (req,res, next)   {

  res.locals.user = req.user || null ;
    // console.log("index.js : " + req.locals.user)
  next();
});

app.get('/testing' , (req,res) => {

res.send("req.user = " + req.user)

})


// Bring in models
let Song = require("./models/song.js")

// Home Page Route
app.get('/home',  (req, res) => {

username = req.user.username.toUpperCase() ;

  Song.find({}, (err, songs) => {
    res.render('home', {
      songs: songs,
      username : username


  })
  })
});



// Update & Edit Song Route
app.post('/edit/:id', (req, res) => {

  let song = {};

  song.title = req.body.title;
  req.body.title = req.body.title.replace(/\s/g, '');
  song.artist = req.body.artist;
  req.body.artist = req.body.artist.replace(/\s/g, '');
  song.url = "https://www.google.com/search?q=" + req.body.artist + "+" + req.body.title ;

  let query = {
    _id: req.params.id
  }

  Song.update(query, song, (err) => {

    if (err) {
      console.log(err)
    } else {
      req.flash('success' , 'Updated')
      res.redirect('../home')
    }
  })
})


// Router Files

let songs = require('./router/songs');
app.use('/songs' , songs)

let users = require('./router/users')
app.use('/users' , users)




app.listen('3000', () => {
  console.log('We Live on Port 3000')
})
