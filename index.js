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
const ORIG_URL = 'https://www.ptt.cc/bbs'
const data
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
    data = {
      borad: tag[1],
      filter: tag[2],
      pageRange: tag[3]
    }

    if (msg === '幫') {
      e.reply('幫忙資訊').then((data) => {
        return
      }).catch((err) => {
        return
      })
    }

    if (!data.borad || !data.filter || !data.pageRange) {
      e.reply(`資料格式錯誤喵~ \\n 您的資料長成這樣子呦! \\n 板名: ${data.borad || '沒有資料'}，篩選名稱: ${data.filter || '沒有資料'}，頁數: ${data.pageRange || '沒有資料'}`).then((data) => {
        return
      }).catch((err) => {
        return
      })

    } else {
      e.reply('開始認真爬文喵~!')
    }

    titleFilter = data.filter
    pageNum = data.pageRange


  } else {
    e.reply('請輸入利用文字輸入喵~\\n 使用方式請輸入: @PTT版名稱.篩選名稱.頁數 。\\n篩選名稱如果輸入"全"則會抓取全部文章，頁數最多只能10頁喵~')
  }
})

app.post('/', linebotParser)

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port
  console.log("App now running on port", port)
})

// function getTopPages(callback) {
//   request(`${ORIG_URL}/${data.borad}/index.html`, (err, res, body) => {
//     const $ = cheerio.load(body)
//     const prev = $('.btn-group-paging a').eq(1).attr('href').match(/\d+/)[0]
//     const pageList = []
//     let i
//     pageList.push('')
//     for (i = 0; i < data.pageRange - 1; i += 1) {
//       pageList.push(prev - i)
//     }
//     callback(pageList)
//   })
// }

// function getPosts(page, callback) {
//   request(`${ORIG_URL}/${data.borad}/index${page}.html`, (err, res, body) => {
//     const $ = cheerio.load(body)
//     const posts = $('.r-ent a').map((index, obj) => {
//       return $(obj).attr('href')
//     }).get()
//     callback(posts)
//   })
// }

// function getImages(post, callback) {
//   request('https://www.ptt.cc' + post, (err, res, body) => {
//     let images = body.match(/imgur.com\/[0-9a-zA-Z]{7}/g);
//     images = [ ...new Set(images) ]
//     callback(images);
//   })
// }