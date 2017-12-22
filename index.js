const request = require('request')
const cheerio = require('cheerio')
const async = require('async')
const linebot = require('linebot')
const express = require('express')
const app = express()
const bot = linebot({
  channelId: 1553044439,
  channelSecret: '486c25f854227f214defba78cbb0bf26',
  channelAccessToken: 'ef63f71C7YwPu2mxk2a/NxFiXmU9ufXOkXqjzymWAboU0lYgpgv2pUal5KQwFa/cBs+ln+JcVVzcBwIeFkGlwQdiZoAa+P8ohPF/HJogYMywjh6bcuTQCkyszyVJkd9lpetjzgIWO+YFAYmfUcjh/QdB04t89/1O/w1cDnyilFU=',
})
const regex = /\@(.*)\.(.*)\.(.*)/
const linebotParser = bot.parser()
const ORIG_URL = 'https://www.ptt.cc/bbs/'
let titleFilter = ''
let indexNum = ''
let pageNum
let lineEvent


bot.on('message', (e) => {
  lineEvent = e
  if (e.message.type === 'text') {
    let msg = e.message.text
    let url = ''

    const tag = msg.match(regex)
    const data = {
      borad: tag[1],
      filter: tag[2],
      pageRange: tag[3]
    }

    if (msg === '幫') {
      e.reply('幫忙資訊').then((data) => {
        console.log(data)
        return
      }).catch((err) => {
        console.log(err)
        return
      })
    }

    if (!data.borad || !data.filter || !data.pageRange) {
      e.reply(`資料格式錯誤喵~ \\n 您的資料長成這樣子呦! \\n 板名: ${data.borad || '沒有資料'}，篩選名稱: ${data.filter || '沒有資料'}，頁數: ${data.pageRange || '沒有資料'}`).then((data) => {
        console.log(data)
        return
      }).catch((err) => {
        console.log(err)
        return
      })
    } else {
      e.reply('開始認真爬文喵~!').then((data) => {
        console.log(data)
      }).catch((err) => {
        console.log(err)
      })
    }
    url = ORIG_URL + data.borad
    titleFilter = data.filter
    pageNum = data.pageRange
    getInfo(url)

  } else {
    e.reply('請輸入利用文字輸入喵~\\n 使用方式請輸入: @PTT版名稱.篩選名稱.頁數 。\\n篩選名稱如果輸入"全"則會抓取全部文章，頁數最多只能10頁喵~').then((data) => {
      console.log(data)
    }).catch((err) => {
      console.log(err)
    })
  }
})

app.post('/', linebotParser)

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port
  console.log("App now running on port", port)
})

function getInfo(url) {
  let i
  let j
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

    // 利用用標題過濾
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