const express = require('express')
const fs = require('fs')
const path = require('path')
const ReactDOMServer = require('react-dom/server')
const setupDevServer = require('./setup-dev-server')

const resolve = _path => path.join(__dirname, '..', _path)

const app = express()
const isProd = process.env.NODE_ENV === 'production'

let serverEntry
let template
let readyPromise

if (isProd) {
  serverEntry = require('../dist/entry-server')
  template = fs.readFileSync(resolve('dist/index.html'), 'utf-8')
  app.use('/dist', express.static(resolve('dist')))
  app.use('/public', express.static(resolve('public')))
  // 静态资源映射到dist路径下

} else {
  readyPromise = setupDevServer(app, (s, t) => {
    serverEntry = s
    template = t
  })
}

const render = (req, res) => {
  console.log('======enter server======')
  console.log('visit url: ' + req.url)
  let html = ReactDOMServer.renderToString(serverEntry)
  let htmlStr = template.replace('<!--react-ssr-outlet-->', `<div id="app">${html}</div>`)
  // 将渲染后的html字符串发送给客户端
  res.send(htmlStr)
}


app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
})



app.listen(3000, () => {
  console.log('Your app is running')
})
