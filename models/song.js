let mongoose = require('mongoose')


let SongSchema = mongoose.Schema({

title: {
  type : String
},
artist: {
  type : String
},
url : {
  type : String
}

});

let Song = module.exports = mongoose.model('Song', SongSchema )
