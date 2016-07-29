// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();
//require body-parser in our app
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));


/************
 * DATABASE *
 ************/
var db = require('./models');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

/*
 * JSON API Endpoints
 */

//Get API Data
app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

//Get All Album List
app.get('/api/albums', function album_index(req, res){
  db.Album.find()
      .exec(function(err, albums) {
      if (err) { 
        return console.log("index error: " + err); 
      }
      res.json(albums);
  });
});

//Post New Album
app.post('/api/albums', function album_add(req, res){
  var newAlbum = req.body;
  var newAlbumGenres = newAlbum.genres;
  var genresArray = newAlbumGenres.split(',');
  newAlbum.genres = genresArray;

  db.Album.create(newAlbum, function(err, album) {
    res.json(album);
  });
});

//Post New Song
app.post('/api/albums/:album_id/songs', function song_add(req, res){
  var newSong = req.body;
  var albumId = req.params.album_id;
  db.Album.findById(albumId, function(err, album){
    album.songs.push(newSong);
    album.save(function(err, album){
      if(err){
        console.log(err);
      }
      res.json(album);
    });
  });
});

app.delete('/api/albums/:id', function delete_song(req, res){
  var deletedAlbumId = req.params.id;
  db.Album.findOneAndRemove({ _id: deletedAlbumId }, function(err, deletedAlbum){
    res.json(deletedAlbum);
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
}); 