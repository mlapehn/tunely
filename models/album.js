var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	Song = require("./song.js");

var AlbumSchema = new Schema({
	songs: [ Song ],
	artistName: String,
	name: String,
	releaseDate: String,
	genres: [ String ]
});

var Album = mongoose.model('Album', AlbumSchema);
module.exports = Album;