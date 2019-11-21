const FetchPlus = require('@fetch-plus/wechat')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  fetch: FetchPlus.fetch
}

// fetch test
const fetch = FetchPlus.fetch
const basePlugin = FetchPlus.basePlugin
fetch.use(basePlugin({
  baseUrl: 'https://unpkg.com',
  search: { meta: true },
  body: {}
}), 0)

fetch('/:module', {
  search: {
    module: 'react'
  }
}).then(data => {
  console.log(data)
})
