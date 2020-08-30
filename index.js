var { google } = require('googleapis');
var officialcharts = require('./officialcharts.js');
var deletePlaylistItems = require('./deletePlaylistItems.js');
var youtube = require('./youtube.js');
const util = require('util');
const playlistId = "PLfAwBbHA3N6fOINFmXT2264h51LfS_TlF";

if (!util.promisifyMethod) {
  util.promisifyMethod = function (fn, obj) {
    return util.promisify(fn).bind(obj);
  }
}

youtube.authorize(run);

async function run(auth) {
  var service = google.youtube('v3');
  await deletePlaylistItems.delete(service, auth, playlistId);
  const songs = await officialcharts.getSongsList();
  const videoIds = [];
  for (const song of songs) {
    let response = await getVideo(service, auth, song.artist + ' ' + song.title);
    let video = response.data.items[0];
    let index = parseInt(song.position) - 1;
    videoIds[index] = video.id.videoId;
    console.log(video.snippet.title + ' - id: ' + video.id.videoId);
  }
  await addVideosToPlaylist(service, auth, videoIds.reverse());
}

function getVideo(service, auth, q) {
  const listService = util.promisifyMethod(service.search.list, service.search);
  return listService({
    auth: auth,
    part: 'snippet',
    type: 'video',
    q: q
  });
}

async function addVideosToPlaylist(service, auth, videoIds) {
  for (const videoId of videoIds) {
    await addToPlaylist(service, auth, videoId);
  }
}

function addToPlaylist(service, auth, videoId) {
  console.log('inserting: ' + videoId);
  const insertService = util.promisifyMethod(service.playlistItems.insert, service.playlistItems);
  return insertService({
    auth: auth,
    part: 'snippet',
    mine: true,
    resource: {
      snippet: {
        playlistId: playlistId,
        resourceId: {
          kind: "youtube#video",
          videoId: videoId
        }
      }
    }
  });
}
