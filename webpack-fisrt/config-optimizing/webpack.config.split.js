const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  mode: 'production',
  // entry: '../src/index.split.js',
  entry: {
    english: "./src/english.js",
    math: "./src/math.js",
    chinese: "./src/chinese.js",
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    // filename: '[name].bundle.js',
    publicPath: '/'
  },
  optimization: {
    minimize: false, // 默认true,代码压缩
    splitChunks: {
      chunks: "all", //  async
      //生成的公共模块(打包后的文件)的最小size，单位是bytes,超出就会被分离。
      minSize: 50,
      //将大于maxSize的块拆分成更小的部分。拆解后的文件最小值为minSize，或接近minSize的值。
      maxSize: 130,
      //假设我们生成了一个公用文件名字叫version，class-a,和class-b都依赖他，并且我们设置的连接符是"~"那么，最终生成的就是 version~class-a~class-b.js。
      // 此选项使您可以自定义连接符。
      automaticNameDelimiter: '~',
    }
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}