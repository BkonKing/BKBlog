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
      // 跟maxSize一样，只是只影响async异步块
      // maxAsyncSize: 150,
      // 跟maxSize一样，只是只影响初始加载块
      // maxInitialSize: 200,
      //单个入口文件的最大并行请求数，换句话来讲就是每一个入口文件打包完成后最多能有多少个模块组成(引入多少个模块)。
      //为2时，有3个入口，可能会因为某两个文件已经引入两个文件导致第3个文件尽管和其他两个文件有共同引入的文件，但是以为其他两个已达上限，则第三个文件则没必要导入不分离
      // maxInitialRequests: 2, //default: 3
      // （应该也是单个入口文件的）按需加载时（异步）的最大并行请求数。结合chunks的备注来看
      // maxAsyncRequests: 5, //default: 5
      // minChunks: 1, //default: 1 在分割一个模块之前必须共享的最小块数(公用块必须大于等于这个值)。
      //假设我们生成了一个公用文件，chinese、english和math都依赖他（都有使用到他），并且我们设置的连接符是"~"那么，最终生成的就是 chinese~english~math.js。
      // 此选项使您可以自定义连接符。
      // automaticNameDelimiter: '~', // default: '~'
      //设置为true会根据chunks和缓存组的key来自动命名。
      //设置为string或者function (module) 来确定你想要的命名。
      //如果name和入口文件name相同，入口文件将被移除。
      //如果给不同的spilt chunk分配相同的name，所有的依赖项都将被打包进同一个公共chunk
      // name: 'vender',  //default: true

      //cacheGroups的配置项会继承splitChunks.*的配置，但是test，priority和reuseExistingChunk只能在cacheGroups中配置。
      //如果不需要默认的cacheGroups，设置为false,如此cacheGroups: { default: false }
      cacheGroups: {
        defaultVendors: {
          //一个模块可能属于多个缓存组。我们会根据具有更高优先级的缓存组来对它进行优化（简单的说就是优先级更高的缓存组才具有打包它的资格）。默认组具有负优先级，允许自定义组具有更高的优先级
          priority: 0, //default:0 默认值为0
          //如果当前chunk包含已经从主bundle中分离出来的模块(如果当前chunk包含的模块已经被主bundle打包进去)，那么它将被重用，而不是生成一个新的块(不再被打包进当前chunk)。这可能会影响块的结果文件名(chunk name)。
          reuseExistingChunk: true,
          //允许按模块类型将模块分配到缓存组。
          type: 'json', //function RegExp string
          // function (module, chunk) => boolean RegExp string
          //确定缓存组会选择哪些模块进行优化。默认会对所有模块进行优化。你可以对路径或者chunk name做匹配。如果匹配到一个chunk name，它的所有子模块都会被选择进行优化。
          test(module, chunks) {
            return module.type === 'javascript/auto';
          },
          //string function (chunkData): string
          //配置chunk name。output.filename的命名规则在这里也适用。
          //该选项也可以通过splitChunks.filename全局配置，但是我们不建议这么做，因为如果splitChunks.chunks没有设置为initial，有可能引发报错。
          filename: '[name].bundle.js'
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}