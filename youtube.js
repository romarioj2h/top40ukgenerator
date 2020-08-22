var {google} = require('googleapis');
var top40 = require('./top40.js');
var service = require('./service.js');

service.authorize(run);

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function run(auth) {
  var service = google.youtube('v3');
  top40.getSongsList().then(songs => {
    //songs = songs.slice(0, 2);
    const videoIds = [];
    for(const song of songs) {
      getVideo(service, auth, song.artist + ' ' + song.title, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        let video = response.data.items[0];
        let index = parseInt(song.position) - 1;
        videoIds[index] = video.id.videoId;
        if (videoIds.filter(el => {
          return el != null;
        }).length == 40) {
          addVideosToPlaylist(service, auth, videoIds);
        }
        console.log(video.snippet.title + ' - id: ' + video.id.videoId);
      });
    }
  });
}

function getVideo(service, auth, query, callback) {
  service.search.list({
    auth: auth,
    part: 'snippet',
    type: 'video',
    q: query
  }, callback);
}

function addVideosToPlaylist(service, auth, videoIds) {
  for(const videoId of videoIds) {
    addToPlaylist(service, auth, videoId);
  }
}

function addToPlaylist(service, auth, videoId) {
  service.playlistItems.insert({
    auth: auth,
    part: 'snippet',
    mine: true,
    resource: {
      snippet: {
        playlistId: "PLfAwBbHA3N6fOINFmXT2264h51LfS_TlF",
        resourceId: {
          kind: "youtube#video",
          videoId: videoId
        }
      }
    }
  }).then(result => {
    console.log('ok');
    console.log(result);
  }).catch(error => {
    console.log('ok');
    console.log(error);    
  });
}