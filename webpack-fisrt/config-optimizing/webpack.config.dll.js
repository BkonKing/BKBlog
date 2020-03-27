//webpack.config.dll.js
const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    //不会频繁更新的库进行单独出来编译
    vue: ['vue']
  },
  mode: 'production',
  output: {
    filename: '[name].dll.[hash:6].js',
    //之所以将动态链接库单独放在 dll 目录下，主要是为了使用 CleanWebpackPlugin 更为方便的过滤掉动态链接库。
    path: path.resolve(__dirname, '../dist', 'dll'),
    library: '[name]_dll' //暴露给外部使用
    //libraryTarget 指定如何暴露内容，缺省时就是 var
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist')
  },
  plugins: [
    new webpack.DllPlugin({
      //name和library一致
      name: '[name]_dll',
      //manifest.json 用于让 DLLReferencePlugin 映射到相关依赖上。
      path: path.resolve(__dirname, 'dist', 'dll', 'manifest.json') //manifest.json的生成路径
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] //不删除dll目录
    })
  ]
}
