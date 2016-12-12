const chalk = require('chalk')
const cheerio = require('cheerio')
const request = require('request')
const columnify = require('columnify')

function scrapeGrant(url, parent, cb) {
  return new Promise((resolve, reject) => {
    request(url, (err, response, html) => {
      if (err) reject(err)

      const $ = cheerio.load(html)

      const grants = $(parent).map((i, elm) => {
        const listing = $(elm)
        return cb(listing)
      }).get()

      resolve(grants)
    })
  })
}

async function scrape() {
  let grants = await Promise.all(
    [
      scrapeGrant('http://www.artshow.com/juriedshows/west.html', '.listing', (grant) => ({
        deadline: '',
        description: '',
        location: '',
        title: grant.find('h4').text(),
        url: grant.find('a').eq(1).attr('href'),
      })),
      // http://www.sfartistnetwork.org/calls-for-artists.html
      // http://www.cac.ca.gov/opportunities/publicart.php
      // http://www.cac.ca.gov/opportunities/artist.php
      // http://www.entrythingy.com/forartists_calls
      // http://www.creativesonoma.org/grants/
      // http://www.cranbrookart.edu/library/research/grants.htm
      // http://www.artheals.org/artist-support/art_grants.html
      //
    ]
  )
  grants = [].concat.apply([], grants) // flatten
  const columns = columnify(
    grants.map((grant) => ({
      title: chalk.green(grant.title),
      url: chalk.gray(`(${grant.url})`),
    }))
  )
  console.log(columns)
}

scrape()
