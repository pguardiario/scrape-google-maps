# scrape-google-maps
Scrape google maps data from any html

## install
npm i --save scrape-google-maps

## use
const parse = require('scrape-google-maps')

let parsed = await fetch(someGoogleUrl).then(r => r.text()).then(parse)