var { google } = require('googleapis');
var top40 = require('./officialcharts/top40.js');
var playlistItems = require('./youtube/playlistItems.js');
var search = require('./youtube/search.js');
var autorization = require('./youtube/autorization.js');
const util = require('util');
const playlistId = "PLfAwBbHA3N6fOINFmXT2264h51LfS_TlF";

if (!util.promisifyMethod) {
  util.promisifyMethod = function (fn, obj) {
    return util.promisify(fn).bind(obj);
  }
}

autorization.authorize(run);

async function run(auth) {
  var service = google.youtube('v3');
  const songs = await (await top40.getSongsList()).reverse();
  await playlistItems.clean(service, auth, playlistId);
  for (const song of songs) {
    let response = await search.list(service, auth, song.artist + ' ' + song.title);
    let video = response.data.items[0];
    console.log(video.snippet.title + ' - id: ' + video.id.videoId);
    await playlistItems.insert(service, auth, video.id.videoId);
  }
}
