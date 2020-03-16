const merge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.config.base');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', //打包后的文件名
      config: config.template, // html中可以读取配置信息
      path: ''
      // 缩小输出控制配置（webpack模式为生产模式默认开启）
      // minify: {
      //   removeAttributeQuotes: false, //是否删除属性的双引号
      //   collapseWhitespace: false, //是否折叠空白
      //   removeComments: true, // 删除HTML注释
      //   collapseWhitespace: true, // 折叠空格（删除空格，猜测）
      //   removeAttributeQuotes: true // 尽可能删除属性周围的引号
      //   https://github.com/kangax/html-minifier#options-quick-reference
      // },
      // hash: true //是否加上hash，默认是 false（附加到所有包含的脚本和CSS文件中）
    }),
    // 这里将 OptimizeCssPlugin 直接配置在 plugins 里面，那么 js 和 css 都能够正常压缩
    // 如果你将这个配置在 optimization，那么需要再配置一下 js 的压缩(开发环境下不需要去做CSS的压缩，因此后面记得将其放到 webpack.config.prod.js 中哈)
    new OptimizeCssPlugin(),
    // 进行js文件的压缩
    new UglifyJsPlugin({
      uglifyOptions: {
        // 压缩警告
        compress: {
          warnings: false
        }
      },
      sourceMap: false,
      // 多线程进行
      parallel: true
    }),
    // 该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境。
    new webpack.HashedModuleIdsPlugin(),
    // 提升(hoist)或者预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度。
    // 这种连结行为被称为“作用域提升(scope hoisting)”。
    // new webpack.optimize.ModuleConcatenationPlugin(),
    new CleanWebpackPlugin(),
    // 不删除某些文件
    // new CleanWebpackPlugin({
    //     cleanOnceBeforeBuildPatterns:['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
    // }),
    new CopyWebpackPlugin([
      {
        from: 'public/js/*.js',
        to: path.resolve(__dirname, 'dist', 'js'),
        flatten: true, // 设置为 true，那么它只会拷贝文件，而不会把文件夹路径都拷贝上
      },
      //还可以继续配置其它要拷贝的文件
    ], {
      ignore: ['other.js'] //过滤文件
    }),
  ]
})

//gzip压缩
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

module.exports = webpackConfig