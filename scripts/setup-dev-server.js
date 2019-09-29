const path = require('path')
const webpack = require('webpack')
const MFS = require('memory-fs')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const clientConfig = require('../build/webpack.client')
const serverConfig = require('../build/webpack.server')

module.exports = function setupDevServer (app, cb) {
  return new Promise((resolve, reject) => {
    let serverEntry
    let template

    // 内容
    const update = () => {
      if (template && serverEntry) {
        cb(serverEntry, template)
        resolve()
      }
    }
    // 读取文件方法
    const readFile = (fs, fileName) => {
      return fs.readFileSync(path.join(clientConfig.output.path, fileName), 'utf-8');
    }

    // 热更新
    clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
    // 开发环境下不需要hash
    clientConfig.output.filename = '[name].js'
    clientConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    )
    const clientCompiler = webpack(clientConfig)

    const devMiddleware = webpackDevMiddleware(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      noInfo: true
    })
    const hotMiddleware = webpackHotMiddleware(clientCompiler, {
      heartbeat: 5000
    })
    // 使用开发中间件
    app.use(devMiddleware)
    // 使用热更新中间件
    app.use(hotMiddleware)

    clientCompiler.hooks.done.tap('done', stats => {

      const info = stats.toJson()
      if (stats.hasWarnings()) {
        console.warn(info.warnings)
      }

      if (stats.hasErrors()) {
        console.error(info.errors)
        return
      }
      // 读取index.html
      template = readFile(devMiddleware.fileSystem, 'index.html')
      console.log('-------- update --------')
      update()
    })

   

    // 服务端部分
    const serverCompiler = webpack(serverConfig)
    // 将输出文件存入内存中
    const mfs = new MFS()
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err, stats) => {
      if (err) throw err
      stats = stats.toJson()
      if (stats.errors.length) return

      const bundle = readFile(mfs, 'entry-server.js')
      const m = new module.constructor()
      m._compile(bundle, "entry-server.js")
      serverEntry = m.exports

      update()
    })
  })
}
