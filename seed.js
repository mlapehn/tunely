// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var albumList =[];
albumList.push({
              artistName: 'Linkin Park',
              name: 'Meteora',
              releaseDate: '1994, March 8',
              genres: [ 'rap rock']
            });
albumList.push({
              artistName: 'Nirvana',
              name: 'Bleach',
              releaseDate: '1989, June 15',
              genres: [ 'Grunge' ]
            });
albumList.push({
              artistName: 'Stone Temple Pilots',
              name: 'Purple',
              releaseDate: '1994, June 7',
              genres: [ 'Grunge' ]
            });


var sampleSongs = [];

sampleSongs.push({ name: 'Famous',
                   trackNumber: 1
});
sampleSongs.push({ name: "All of the Lights",
                   trackNumber: 2
});
sampleSongs.push({ name: 'Guilt Trip',
                   trackNumber: 3
});
sampleSongs.push({ name: 'Paranoid',
                   trackNumber: 4
});
sampleSongs.push({ name: 'Ultralight Beam',
                   trackNumber: 5
});
sampleSongs.push({ name: 'Runaway',
                   trackNumber: 6
});
sampleSongs.push({ name: 'Stronger',
                   trackNumber: 7
});


albumsList.forEach(function (currentValue, index) {
   albumsList[index].songs = [];
   sampleSongs.forEach(function (currentValueSongs, indexSongs) {
       albumsList[index].songs.push(sampleSongs[indexSongs]);
   });
});


db.Album.remove({}, function(err, albums){});

  db.Album.create(albumList, function(err, albums){
    if (err) { return console.log('ERROR', err); }
    console.log("all albums:", albums);
    console.log("created", albums.length, "albums");
    process.exit();
  });

});