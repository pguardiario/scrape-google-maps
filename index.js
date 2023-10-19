const cheerio = require('cheerio')
const fs = require('fs')

let re = /\s*[⋅·]\s*/

function parseInfo(values) {
  let data = {
    location: values.shift()
  }
  for(let value of values){
    switch(true){
      case !!value.match(/^(open|closed)$/i):
        data.status = value
        break
      case !!value.match(/^(open|close)/i):
        data.schedule = value
        break
      case !!value.match(/\b\d{3}\b.*\b\d{4}\b/i):
        data.phone = value
        break
      default:
        break
    }
  }
  return data

}

function parse(html) {
  let $ = cheerio.load(html)
  let data = $('[data-cid]').get().reduce((acc, el) => {
    let cid = $(el).attr('data-cid')
    acc[cid] = acc[cid] || {}
    switch(true){
      case !!$(el).find('[class$="_details"]')[0]:
        let divs = $(el).find('[class$="_details"] > div').get()
        let name = $(divs.shift()).text()

        if($(divs[0]).text().match(/\d\.\d\(\d+\)|reviews/)){
          let [reviews, priceLevel, type] = $(divs.shift()).text().split(re)
          if(type){
            acc[cid].priceLevel = priceLevel.length
          } else {
            type = priceLevel
          }
          let match = reviews.match(/(\d\.\d)\((\d+)\)/)
          if(match) {
            acc[cid].averageRating = Number(match[1])
            acc[cid].reviewCount = Number(match[2])
          }
          acc[cid].type = type
        }

        let info = $(divs.pop()).text().split(re).filter(s => s.match())

        acc[cid] = {...acc[cid], ...parseInfo(divs.map(div => $(div).text().split(re)).flat())}

        let [location, phone] = $(divs.shift()).text().split(re)
        let [status, schedule] = divs[0] ? $(divs.shift()).text().split(re) : []

        acc[cid] = {
          ...acc[cid], name, location, phone, info, status, schedule
        }
        break
      case !!$(el).find('g-img img[src]')[0]:
        // acc[cid].image = $(el).find('g-img img[src]').attr('src')
        break

      default:
        debugger
    }
    return acc
  }, {})
  // fs.writeFileSync('maps.json', JSON.stringify(data, null, 2))
  return data
}

// console.log(parse(fs.readFileSync('test.html')))

module.exports = parse
