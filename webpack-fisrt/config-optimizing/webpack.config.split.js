const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  mode: 'production',
  // entry: './src/index.split.js',
  entry: {
    english: "./src/english.js",
    math: "./src/math.js",
    chinese: "./src/chinese.js",
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors1: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}