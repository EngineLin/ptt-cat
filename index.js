const request = require('request')
const cheerio = require('cheerio')
const async = require('async')
const linebot = require('linebot')
const express = require('express')

const app = express()
const bot = linebot({
  channelId: 1553044439,
  channelSecret: '486c25f854227f214defba78cbb0bf26',
  channelAccessToken: 'ef63f71C7YwPu2mxk2a/NxFiXmU9ufXOkXqjzymWAboU0lYgpgv2pUal5KQwFa/cBs+ln+JcVVzcBwIeFkGlwQdiZoAa+P8ohPF/HJogYMywjh6bcuTQCkyszyVJkd9lpetjzgIWO+YFAYmfUcjh/QdB04t89/1O/w1cDnyilFU='
})

const linebotParser = bot.parser()
const ORIG_URL = 'https://www.ptt.cc/bbs/'



bot.on('message', (e) => {
  if (e.message.type === 'text') {
    let msg = e.message.text
    let replyMsg = ''
    let url = ''

    if (msg.indexOf('表特') !== -1) {
      replyMsg = '幫忙資訊!'
    }

    if (msg.indexOf('喵') !== -1) {
      replyMsg = '喵喵~!'
    }

    if (msg.indexOf('表特') !== -1) {
      url = ORIG_URL + 'beauty'
    }

    if (msg.indexOf('八卦') !== -1) {
      url = ORIG_URL + '八卦'
    }
    

    if (url) {
      e.reply('為了主人，努力爬文喵~!')
      tempUrl = url + '/index.html'
      getInfo(tempUrl)
    } else {
      replyMsg = '主人說什麼?@u@ 我不太了解喵。'
      sendData()
    }

    function getInfo(url) {
      request(url, (err, res, body) => {
        const $ = cheerio.load(body)
        let list = $('.r-ent a').map((index, obj) => {
          return {
            title: $(obj).text().trim(),
            link: $(obj).attr('href'),
            timestamp: $(obj).attr('href').substr(14, 10),
          }
        }).get()
        console.log(list)
        replyMsg = list[1].title
        sendData()
      })
    }

    function sendData() {
      // 傳送資料
      e.reply(replyMsg).then((data)=> {
        console.log(data)
      }).catch((err) => {
        console.log(err)
      })
    }

  } else {
    e.reply('請輸入文字喵~ 可以輸入"幫"，讓我為主人解釋使用方式!')
  }
})

app.post('/', linebotParser)

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port
  console.log("App now running on port", port)
})