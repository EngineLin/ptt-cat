const request = require('request')
const cheerio = require('cheerio')
const async = require('async')

const CrontabPeriod = 60 * 60 * 24
const titleFilter = '生活'
const ORIG_URL = 'https://www.ptt.cc/bbs/BigBanciao'
const pageNum = 10
let indexNum = ''
let i = 0
let j = 0

getInfo(ORIG_URL)

function getInfo(url) {
  request(url, (err, res, body) => {
    const $ = cheerio.load(body)
    if ( j === 0 ) {
      j += 1
      const exgex = /index(.*[^a-z][^A-Z]).html/
      let prevPageHref = $($('.btn-group-paging a')[1]).attr('href')
      indexNum = exgex.exec(prevPageHref)[1]
    } else {
      indexNum -= 1
    }

    // 抓取文章列表
    let list = $('.r-ent a').map((index, obj) => {
      return {
        title: $(obj).text().trim(),
        link: $(obj).attr('href'),
        timestamp: $(obj).attr('href').substr(14, 10),
      }
    }).get()

    // 利用時間過濾
    // list = list.filter((post) => {
    //   return post.timestamp > (Date.now() / 1000 - CrontabPeriod)
    // })

    // 必用標題過濾
    list = list.filter((post) => {
      return post.title.indexOf(titleFilter) !== -1
    })

    console.log(list)

    if (i < pageNum) {
      i += 1
      let tempUrl = `${ORIG_URL}/index${indexNum}.html`
      getInfo(tempUrl)
    }
  })
}