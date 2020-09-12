const puppeteer = require('puppeteer');
var topbugger = require('../topbugger.js');

async function getTextContentFromSelector(selector, parentElement) {
  let element = await parentElement.$(selector);
  let elementContentProperty = await element.getProperty('textContent');
  return (await elementContentProperty.jsonValue()).trim();
}

async function filter(arr, callback) {
  const fail = Symbol()
  return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail)
}

exports.getSongsList = async (debug) => {
  const songs = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = 'https://www.officialcharts.com/charts/uk-top-40-singles-chart/';
  topbugger.debug(debug, 'Accessing ' + url);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const trackElements = await filter(await page.$$('.chart tr'), async el => {
    return !!(await el.$('.title-artist'));
  });
  for (const trackElement of trackElements) {
    let song = {
      position: await getTextContentFromSelector('.position', trackElement),
      artist: await getTextContentFromSelector('.artist', trackElement),
      title: await getTextContentFromSelector('.title', trackElement)
    };
    songs.push(song);
    topbugger.debug(debug, song.artist + ' - ' + song.title + ' Found on Official Charts page');
  }
  topbugger.debug(debug, 'Last song found on Official Charts page');
  await browser.close();
  return songs;
};