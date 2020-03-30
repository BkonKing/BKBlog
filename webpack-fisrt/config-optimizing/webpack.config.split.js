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
    minimize: false, // 默认true,代码压缩
    //分离优先级：maxInitialRequest / maxAsyncRequests <maxSize <minSize
    splitChunks: {
      /** 表示对哪些模快进行优化，可选字符串值有 all、 async、initial、和函数。
       * async   表示只对动态（异步）导入的模块进行分离。
       * initial 表示将动态导入的文件和非动态导入的文件分别打包，如果一个模块被动态引入，也被非动态引入。那么这个模块将会被分离2次。被分别打包到不同的文件中。
       * all     表示对所有模块进行分离优化，一般情况下都用all。
       * 跟initial一样，只是将需要的文件分离出一份，而不会分离多次。
       * function (chunk) 代表对指定的模块快分离优化。返回能判断是否的类型，true则分离非动态导入（全部为true跟all一样的效果），false则不分离非动态导入（全部为false跟async一样的效果），可以用chunk.name用来判断，不管返回什么动态导入的都会被分离
       * 如果为false，当一个模块是非动态加载的那么它将不会被分离出去，如果这个模块是动态加载的，它也会被分离出去，并且还是动态引入关系。
       */
      chunks: function (chunk) {
        return chunk.name !== ''
      }, //default: async
      //当抽取的公共模块的大小，大于minSize所设置的值，才会被分离，否则还在原来文件
      minSize: 0, //default: 30000，单位是bytes
      //将大于maxSize的块拆分成更小的部分。拆解后的文件最小值为minSize，或接近minSize的值。
      // maxSize: 130, //default: 0
      //单个入口文件的最大并行请求数，换句话来讲就是每一个入口文件打包完成后最多能有多少个模块组成(引入多少个模块)。
      //为2时，有3个入口，可能会因为某两个文件已经引入两个文件导致第3个文件尽管和其他两个文件有共同引入的文件，但是以为其他两个已达上限，则第三个文件则没必要导入不分离
      // maxInitialRequests: 2, //default: 3
      //假设我们生成了一个公用文件，chinese、english和math都依赖他（都有使用到他），并且我们设置的连接符是"~"那么，最终生成的就是 chinese~english~math.js。
      // 此选项使您可以自定义连接符。
      // automaticNameDelimiter: '~', // default: '~'
      //设置为true会根据chunks和缓存组的key来自动命名。
      //设置为string或者function (module) 来确定你想要的命名。
      //如果name和入口文件name相同，入口文件将被移除。
      //如果给不同的spilt chunk分配相同的name，所有的依赖项都将被打包进同一个公共chunk
      // name: 'vender'  //default: true
    }
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}