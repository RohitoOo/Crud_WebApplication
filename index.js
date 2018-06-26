const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const ejs = require('ejs')
const path = require('path');
const bodyParser = require('body-parser');
const config = require ('./config/database')



mongoose.connect(config.database)

let db = mongoose.connection ;



// Check connection

db.once('open', function() {
  console.log("Connected to MongoDB")
});

// Check for DB errors

db.on('error', function(err) {
  console.log("err")
});

// Initial Express
const app = express() ;

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

// app.get('/home' , (req,res) => {
//
//   res.render('home')
//
// })

// Add Song Route
app.get('/addSong' , (req,res) => {

  res.render('addSong')

})


// Bring in models
let Song = require("./models/song.js")


//
app.get('/home' , (req,res) => {

  Song.find( {} , (err , songs) => {

res.render('home' , {

songs : songs
}) })
});


// Each Song

app.get('/song/:id' , (req,res) => {

  Song.findById(req.params.id , (err , songs) => {

    res.render('song' , {
      songs : songs
    })
  })
})




// Submit Post Route
app.post('/songs/add' , ( req, res ) => {

    let newSong = new Song();

    newSong.title = req.body.title;
    req.body.title = req.body.title.replace(/\s/g,'');
    newSong.artist = req.body.artist;
    req.body.artist = req.body.artist.replace(/\s/g,'')
    newSong.url = "https://www.google.com/search?q=" + req.body.artist + "+" + req.body.title;

    newSong.save(function (err)  {
      if(err) {
        console.log(err)
      }else {
        res.redirect('../home')
      }
    })


})




// Update & Edit Song Route
app.post('/edit/:id' , ( req, res ) => {

let song = {};

song.title = req.body.title;
song.artist = req.body.artist;
req.body.artist = req.body.artist.replace(/\s/g,'');
song.url = "https://www.youtube.com/" + req.body.artist;

let query = {_id: req.params.id}

Song.update(query, song , (err)=> {

  if(err) {
    console.log(err)
  }else {
    res.redirect('../home')
  }

})

})




app.delete('/song/:id' , (req,res) => {

let query = {_id:req.params.id};

Song.remove(query, (err)=> {

  if(err){
    console.log(err)
  }
  else {
    res.send('Success')
  }
})

});

app.post('/addSong' , (req,res) => {

  let newSong = new Song();

  newSong.title = req.body.title;
  newSong.artist = req.body.artist;
  req.body.artist = req.body.artist.replace(/\s/g,'')
  newSong.url = "https://www.youtube.com/" + req.body.artist

  newSong.save(function (err)  {
    if(err) {
      console.log(err)
    }else {
      res.send('Success')
    }
  })

})


app.listen('3000' , () => {
  console.log('We Live on Port 3000')
})
