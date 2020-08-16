const puppeteer = require('puppeteer');
 
async function getTextContentFromSelector(selector, parentElement) {
  let element = await parentElement.$(selector);
  let elementContentProperty = await element.getProperty('textContent');
  return (await elementContentProperty.jsonValue()).trim();
}

async function filter(arr, callback) {
  const fail = Symbol()
  return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i=>i!==fail)
}

(async () => {
  const songs = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.officialcharts.com/charts/uk-top-40-singles-chart/', {waitUntil: 'domcontentloaded'});
  const trackElements = await filter(await page.$$('.chart tr'), async el => {
    return !!(await el.$('.title-artist'));
  });
  for (const trackElement of trackElements) {
    songs.push({
      position: await getTextContentFromSelector('.position', trackElement),
      artist: await getTextContentFromSelector('.artist', trackElement),
      title: await getTextContentFromSelector('.title', trackElement)
    });
  }
  await browser.close();
})();