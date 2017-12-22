// const request = require('request')
// const cheerio = require('cheerio')
// const async = require('async')
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


bot.on('message', (e) => {
  if (e.message.type === 'text') {
    let msg = e.message.text
    const tag = msg.match(regex)
    const borad = tag[1]
    const filter = tag[2]
    const pageRange = tag[3]

    if (msg === '幫') {
      e.reply('幫忙資訊').then((data) => {
        console.log(data)
        return
      }).catch((err) => {
        console.log(err)
        return
      })
    }

    const obj = {}
    obj.borad = borad
    obj.filter = filter
    obj.pageRanger = pageRange
    console.log(JSON.stringify(obj))

    // console.log(tag)

    e.reply(JSON.stringify(obj)).then((data) => {
      console.log(data)
    }).catch((err) => {
      console.log(err)
    })
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