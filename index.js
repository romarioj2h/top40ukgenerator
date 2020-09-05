var { google } = require('googleapis');
var top40 = require('./officialcharts/top40.js');
var playlistItems = require('./youtube/playlistItems.js');
var search = require('./youtube/search.js');
var autorization = require('./youtube/autorization.js');
const yargs = require('yargs');
var colors = require('colors');

const argv = yargs
  .option('playlistId', {
    alias: 'p',
    description: 'Playlist ID to be updated',
    type: 'string',
  })
  .help()
  .alias('help', 'h')
  .argv;

if (!argv.playlistId) {
  console.error('Playlist ID is required, use --help to see available options'.red);
}

autorization.authorize(run);

async function run(auth) {
  var service = google.youtube('v3');
  const songs = await (await top40.getSongsList()).reverse();
  await playlistItems.clean(service, auth, argv.playlistId);
  for (const song of songs) {
    let response = await search.list(service, auth, song.artist + ' ' + song.title);
    let video = response.data.items[0];
    console.log(video.snippet.title + ' - id: ' + video.id.videoId);
    await playlistItems.insert(service, auth, argv.playlistId, video.id.videoId);
  }
}