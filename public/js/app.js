/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */

$(document).ready(function() {
  console.log('app.js loaded!');
  //Populate Album List
  $.get("/api/albums", function(data, status){
        data.forEach(renderAlbum);
  });

  //Setup Search Form
  $("#search-form").submit(function(event){
    event.preventDefault();
    var formdata = $(this).serialize();
    $.post('/api/albums', formdata, function(res){
      renderAlbum(res);
    });
    $(this).trigger("reset");
  });

  // Bring Up Add Song Modal
  var id;
  $('#albums').on('click', '.add-song', function(event) {
    id = $(this).parents('.album').data('album-id');
    $('#songModal').data('album-id', id).modal();
  });
  
  // Handle Song Save in Modal
  $("#saveSong").on('click', function(event){
    handleNewSongSubmit(event, id);
  });

  // Handle Song Delete
  $('#albums').on('click', '.delete-album', function(event) {
    deleteId = $(this).parents('.album').data('album-id');
    var albumURL = "/api/albums/" + deleteId;
    
    $.ajax({
      url: albumURL,
      type: 'DELETE',
      success: function(result){
        deleteAlbum(deleteId);
      }

    });
  });
});

// build the songlist
function buildSongsHtml(songs) {
  var songText = "";
  songs.forEach(function(song){
    songText = songText + song.trackNumber + ". " + song.name + " &ndash; ";
  });
  var songsHTML =
      "<li class='list-group-item'>" +
      "<h4 class='inline-header'>Songs:</h4>" +
      "<span>" + songText + "</span>" +
      "</li>";
  return songsHTML;
}

// this function takes a single album and renders it to the page
function renderAlbum(album) {
  console.log('rendering album:', album);
  var albumHtml =
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" +  album.artistName + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-releaseDate'>" + album.releaseDate + "</span>" +
  "                      </li>" +
                         buildSongsHtml(album.songs) +
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "                  <div class='panel-footer'>" +
  "                   <button class='btn btn-primary add-song'>Add Song</button>" +
    "                 <button class='btn btn-primary delete-album'>Delete Album</button>" +
  "                  </div>" +
  "              </div>" +
  "            </div>" +
  "        </div>";
  // render to the page with jQuery
  $('#albums').append(albumHtml);
}

function reRenderAlbum(id, data) {
  var originalAlbum = $("div").find("[data-album-id='" + id + "']");
  originalAlbum.remove();
  renderAlbum(data);
}

// handle song submission
function handleNewSongSubmit(event, id) {
  event.preventDefault();
  // Build New Song Object
  var newSong = {
    name: $("#songName").val(),
    trackNumber: parseInt($("#trackNumber").val(), 10)
  };
  // Build URL
  var albumURL = "/api/albums/" + id + "/songs";
  // Post to Server
  $.post(albumURL, newSong, function(res){
    reRenderAlbum(id, res);
  });
  // Clear values
  $("#songName").val("");
  $("#trackNumber").val("");
  // Close Modal
  $('#songModal').modal('toggle');
}

// delete an album on frontend
function deleteAlbum(event, deleteId){
  var originalAlbum = $("div").find("[data-album-id='" + deleteId + "']");
  originalAlbum.remove();
  location.reload();
}