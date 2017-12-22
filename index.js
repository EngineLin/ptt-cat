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
    let ev = e
    let msg = e.message.text
    const userId = e.source.userId
    let replyMsg = '主人說什麼?@u@ 我不太了解喵。'
    let url = ''

    if (msg.indexOf('幫') !== -1) {
      replyMsg = '幫忙資訊!'
    }

    if (msg.indexOf('喵') !== -1) {
      replyMsg = '喵喵~!'
    }

    if (msg.indexOf('表特') !== -1) {
      msg = '表特版'
      url = ORIG_URL + 'beauty'
    }

    if (msg.indexOf('八卦') !== -1) {
      msg = '八卦版'
      url = ORIG_URL + 'Gossiping'
    }

    if (msg.indexOf('NBA') !== -1) {
      msg = 'NBA版'
      url = ORIG_URL + 'NBA'
    }

    if (msg.indexOf('股') !== -1) {
      msg = '股票版'
      url = ORIG_URL + 'Stock'
    }

    if (msg.indexOf('性') !== -1) {
      msg = '性版'
      url = ORIG_URL + 'sex'
    }

    if (msg.indexOf('lol') !== -1) {
      msg = 'LoL版'
      url = ORIG_URL + 'LoL'
    }

    if (msg.indexOf('棒球') !== -1) {
      msg = 'Baseball'
      url = ORIG_URL + '棒球'
    }

    if (msg.indexOf('女') !== -1) {
      msg = '女版'
      url = ORIG_URL + 'WomenTalk'
    }

    if (msg.indexOf('手機') !== -1) {
      msg = '手機板'
      url = ORIG_URL + 'MobileComm'
    }

    if (msg.indexOf('電影') !== -1) {
      msg = '電影版'
      url = ORIG_URL + 'movie'
    }

    if (msg.indexOf('韓') !== -1) {
      msg = '韓星版'
      url = ORIG_URL + 'KoreaStar'
    }
    

    if (url) {
      // e.reply('為了主人，努力爬文喵~!')
      tempUrl = url + '/index.html'
      getInfo(tempUrl)
    } else {
      e.reply(replyMsg)
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
        list.filter((obj) => {
          return obj.title.indexOf('公告') !== -1
        })
        replyMsg = `努力為主人追了"${msg}"的最新文章，求摸摸喵~\n`
        list.forEach((obj) => {
          replyMsg += `
            ${obj.title}\n
            https://www.ptt.cc${obj.link}\n
          `
        })
        ev.reply(replyMsg)
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