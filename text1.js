const getJSON = require('get-json')

getJSON('https://www.ptt.cc/bbs/beauty/index.html', (err, res) => {
  console.log(res)
})