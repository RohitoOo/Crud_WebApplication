const express = require('express');
const router = express.Router();


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

  newSong.save(function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('../home')
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

module.exports = router;
