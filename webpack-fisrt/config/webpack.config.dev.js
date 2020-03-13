const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');
const portfinder = require('portfinder'); // 自动获取端口
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
//打包分析
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// 从后往前合并
// merge 合并，也可以使用 merge.smart 合并，merge.smart 在合并loader时，会将同一匹配规则的进行合并
const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: [
      // 根据配置设置规则,devConfig--boolean,fn()--返回一个规则对象
      // ...(devConfig ? [fn()] : [])
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true // 如果将此选项设置为true，则始终返回错误。
        }
      }
    ]
  },
  devServer: {
    quiet: true //对于FriendlyErrorsPlugin是必要的，关闭所有的错误日志记录
  },
  plugins: {
    /* new BundleAnalyzerPlugin({
      //  可以是`server`，`static`或`disabled`。
      //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
      //  在“静态”模式下，会生成带有报告的单个HTML文件。
      //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
      analyzerMode: 'server',
      //  将在“服务器”模式下使用的主机启动HTTP服务器。
      analyzerHost: '127.0.0.1',
      //  将在“服务器”模式下使用的端口启动HTTP服务器。
      analyzerPort: 8881,
      //  路径捆绑，将在`static`模式下生成的报告文件。
      //  相对于捆绑输出目录。
      reportFilename: 'report.html',
      //  模块大小默认显示在报告中。
      //  应该是`stat`，`parsed`或者`gzip`中的一个。
      //  有关更多信息，请参见“定义”一节。
      defaultSizes: 'parsed',
      //  在默认浏览器中自动打开报告
      openAnalyzer: true,
      //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
      generateStatsFile: false,
      //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
      //  相对于捆绑输出目录。
      statsFilename: 'stats.json',
      //  stats.toJson（）方法的选项。
      //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
      //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
      statsOptions: null,
      logLevel: 'info' //日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
    }), */
  }
  //...其它的一些配置
});

function createNotifierCallback() {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || 3000
  portfinder.maximumPort = 9999 // 最大的端口号
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // 发布e2e测试所需的新端口
      process.env.PORT = port
      // 添加修改 devServer config的端口
      devWebpackConfig.devServer.port = port

      // 添加友好提示
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        // https://www.npmjs.com/package/friendly-errors-webpack-plugin
        // 启动成功提示
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors ? createNotifierCallback() : undefined,
        //  是否应在每次编译之间清除控制台？默认为true
        clearConsole: true
      }))

      resolve(devWebpackConfig)
    }
  })
})
