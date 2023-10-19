# scrape-google-maps
Scrape google maps data from any html

## install
npm i --save @pguardiario/scrape-google-maps

## use
```
const puppeteer = require('puppeteer')
const parse = require('scrape-google-maps')

async function run(){
  let browser = await puppeteer.launch()
  let page = await browser.newPage()
  await page.goto("https://www.google.com/search?q=hardware+store+nyc")
  let parsed = parse(await page.content())
  await browser.close()
  console.log(parsed)
}

run()
```