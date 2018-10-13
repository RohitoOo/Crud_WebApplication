const express = require('express');
const router = express.Router();
const passport = require('passport')

// Bring in models
let Song = require("../models/song.js")

// Add Song Route
router.get('/addSong', (req, res) => {
  res.render('addSong')
});

// Each Song
router.get('/:id', (req, res) => {
  Song.findById(req.params.id, (err, songs) => {
    res.render('song', {songs: songs})
  })
})

// Submit Post Route
router.post('/add', (req, res) => {

  let newSong = new Song();

  newSong.title = req.body.title;
  req.body.title = req.body.title.replace(/\s/g, '');
  newSong.artist = req.body.artist;
  req.body.artist = req.body.artist.replace(/\s/g, '')
  newSong.url = "https://www.google.com/search?q=" + req.body.artist + "+" + req.body.title;
  newSong.user = req.body.user

  newSong.save(function(err) {
    if (err) {
      console.log(err)
    } else {
      req.flash('success' , 'Song Added')
      res.redirect('/songs/addSong')
    }
  })
})

router.delete('/:id', (req, res) => {

  let query = {
    _id: req.params.id
  };

  Song.remove(query, (err) => {

    if (err) {
      console.log(err)
    } else {
      res.send('Success')
    }
  })
});

// Access Control

function ensureAuthenticated(req,res,next){
if(req.user){
  return next();
}else{
  res.redirect('/users/login')
}

}

module.exports = router;
