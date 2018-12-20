const puppeteer = require('puppeteer');
let page;

async function getBrowserPage() {
  // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
  const browser = await puppeteer.launch({args: [
    '--no-sandbox'
  ]});
  return browser.newPage();
}

exports.screenshot_example = async (req, res) => {
  if (!page) {
    page = await getBrowserPage();
  }
  
  function scrapeForConsoleMessage(message) {
    return new Promise(function consoleListener(resolve, err) {
      page.on('console', msg => {
        // Turn on debugging with &debug in the request URL
        // All unity output is then logged in stackdriver
        if (req.query.debug) console.log(msg.text());
        if (msg.text() === message) {
          page.removeListener('console', consoleListener);
          resolve();
        }
      });    
    })
  }
  
  url = `https://storage.googleapis.com/public_website/examples/unity-serverless/build/index.html` + 
    `?r=${req.query.r || 0}&g=${req.query.g || 0}&b=${req.query.b || 0}`

  var scraper = scrapeForConsoleMessage('Screenshotter: capture now');
  console.log(`Fetching ${url}`);
  page.setViewport({
    width: 960,
    height: 600
  });
  page.goto(url);
  await scraper;
  console.log("Cloud function: Screenshotting")
  const gameContainerDOM = await page.$('#gameContainer');
  const imageBuffer = await gameContainerDOM.screenshot();
  res.set('Content-Type', 'image/png');
  res.send(imageBuffer);
};