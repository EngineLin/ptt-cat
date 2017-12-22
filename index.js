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

// const regex = /\@(.*)\.(.*)\.(.*)/
const linebotParser = bot.parser()
const ORIG_URL = 'https://www.ptt.cc/bbs/'
const data
// let titleFilter = ''
// let indexNum = ''
// let pageNum


bot.on('message', (e) => {
  lineEvent = e
  if (e.message.type === 'text') {
    let msg = e.message.text
    let replyMsg = ''
    let url = ''

    // const tag = msg.match(regex)
    // data = {
    //   borad: tag[1],
    //   filter: tag[2],
    //   pageRange: tag[3]
    // }

    if (msg === '幫') {
      replyMsg = `幫忙資訊`
    }

    if (msg.indexOf('表特') !== -1) {
      url = ORIG_URL + 'beauty'
    }

    if (msg.indexOf('八卦') !== -1) {
      url = ORIG_URL + '八卦'
    }
    

    if (url) {
      tempUrl = url + '/index.html'
      getPageIndex(tempUrl, (pageList) => {
        async.map(pageList, (page, callback) => {
          getInfo(page)
        }).then(sendData())
      })
    } else {
      replyMsg = '主人說什麼?@u@ 我不太了解耶。'
      sendData()
    }
    
    function sendData() {
      // 傳送資料
      e.reply(replyMsg).then((data)=> {
        console.log(data)
      }).catch((err) => {
        console.log(err)
      })
    }

    function getPageIndex(url, callback) {
      request(url, (err, res, body) => {
        const $ = cheerio.load(body)
        const prev = $('.btn-group-paging a').eq(1).attr('href').match(/\d+/)[0]
        const pageList = [prev, prev - 1]
        callback(pageList)
      })
    }

    function getInfo(page) {
      tempUrl = url + '/index' + page + '.html'
      request(url, (err, res, body) => {
        const $ = cheerio.load(body)
        let list = $('.r-ent a').map((index, obj) => {
          return {
            title: $(obj).text().trim(),
            link: $(obj).attr('href'),
            timestamp: $(obj).attr('href').substr(14, 10),
          }
          replyMsg += list
          console.log(list)
        }).get()
      })
    }
  

    // if (!data.borad || !data.filter || !data.pageRange) {
    //   e.reply(`資料格式錯誤喵~ \\n 您的資料長成這樣子呦! \\n 板名: ${data.borad || '沒有資料'}，篩選名稱: ${data.filter || '沒有資料'}，頁數: ${data.pageRange || '沒有資料'}`).then((data) => {
    //     return
    //   }).catch((err) => {
    //     return
    //   })

    // } else {
    //   e.reply('開始認真爬文喵~!')
    // }

    // titleFilter = data.filter
    // pageNum = data.pageRange


  } else {
    e.reply('請輸入利用文字輸入喵~ 可以輸入"幫"，讓我為主人解釋使用方式!')
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