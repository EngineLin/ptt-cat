const linebot = require('linebot')
const express = require('express')
const app = express()
const bot = linebot({
  channelId: 1553044439,
  channelSecret: '486c25f854227f214defba78cbb0bf26',
  channelAccessToken: 'ef63f71C7YwPu2mxk2a/NxFiXmU9ufXOkXqjzymWAboU0lYgpgv2pUal5KQwFa/cBs+ln+JcVVzcBwIeFkGlwQdiZoAa+P8ohPF/HJogYMywjh6bcuTQCkyszyVJkd9lpetjzgIWO+YFAYmfUcjh/QdB04t89/1O/w1cDnyilFU=',
})
const linebotParser = bot.parser()


bot.on('message', (e) => {
  console.log(e)
})

app.post('/', linebotParser)

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port
  console.log("App now running on port", port)
})