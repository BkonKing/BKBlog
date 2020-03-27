// 测量各个插件和loader所花费的时间
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

//由于有大量文件需要解析和处理，构建是文件读写和计算密集型的操作，特别是当文件数量变多后，Webpack 构建慢的问题会显得严重。
//Happypack把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。
//当项目不是很复杂时，不需要配置 happypack，因为进程的分配和管理也需要时间，并不能有效提升构建速度，甚至会变慢。
const Happypack = require('happypack');

//HardSourceWebpackPlugin 为模块提供中间缓存，缓存默认的存放路径是: node_modules/.cache/hard-source
//配置 hard-source-webpack-plugin，首次构建时间没有太大变化，但是第二次开始，构建时间大约可以节约 80%。
//npm install hard-source-webpack-plugin -D
//https://www.npmjs.com/package/hard-source-webpack-plugin 文档，常见错误
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path');
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const config = {
  mode: 'production',
  entry: './src/index.optimizing.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle[hash:6].js',
    publicPath: '/'
  },
  module: {
    /**
     * 如果一些第三方模块没有AMD/CommonJS规范版本，可以使用 noParse 来标识这个模块
     * 这样 Webpack 会引入这些模块，但是不进行转化和解析，从而提升 Webpack 的构建性能,例如：jquery 、lodash
     */
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.js[x]?$/,
        //npm install cache-loader -D
        //cache-loader放在其他 loader 之前即可，可以放在耗时长的loader前
        //首次耗时较长，非首次就会加快编译
        /**
         * 如果只打算给 babel-loader 配置 cache 的话，也可以不使用 cache-loader，给 babel-loader 增加选项 cacheDirectory。
         * cacheDirectory：默认值为 false。当有设置时，指定的目录将用来缓存 loader 的执行结果。
         * 之后的 Webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程。
         * 设置空值或者 true 的话，使用默认缓存目录：node_modules/.cache/babel-loader。
         * 开启 babel-loader的缓存和配置 cache-loader，构建时间很接近。
         */
        use: ['cache-loader', 'babel-loader'],
        // npm install thread-loader -D
        /**
         * 把 thread-loader 放置在其它 loader 之前，那么放置在这个 loader 之后的 loader 就会在一个单独的 worker 池中运行。
         * 在 worker 池(worker pool)中运行的 loader 是受到限制的。例如：
         * 这些 loader 不能产生新的文件。
         * 这些 loader 不能使用定制的 loader API（也就是说，通过插件）。
         * 这些 loader 无法获取 webpack 的选项设置。
         */
        // thread-loader 和 Happypack 对比了一下，构建时间基本没什么差别。
        // use: ['thread-loader', 'cache-loader', 'babel-loader'],
        //通过 exclude、include 配置来确保转译尽可能少的文件。
        //exclude 指定要排除的文件，include 指定要包含的文件。
        //exclude 的优先级高于 include，在 include 和 exclude 中使用绝对路径数组
        //尽量避免 exclude，更倾向于使用 include。
        // exclude: /node-modules/
        include: [path.resolve(__dirname, '../src')]
      },
      {
        test: /\.(le|c)ss$/,
        // use: ['css-loader', 'less-loader'],
        use: 'Happypack/loader?id=less',
        include: [path.resolve(__dirname, '../src')]
      }
    ]
  },
  //resolve优化，配置modules从哪里查找第三方插件
  //resolve 的 extensions 配置，默认是 ['.js', '.json']，如果你要对它进行配置，记住将频率最高的后缀放在第一位，并且控制列表的长度，以减少尝试次数
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  externals: {
    //jquery通过script引入之后，全局中即有了 jQuery 变量
    //仍然可以通过 import 的方式去引用(如 import $ from 'jquery')
    //并且 webpack 不会对其进行打包
    'jquery': 'jQuery'
  },
  plugins: [
    // 用在文件多耗时长的loader
    new Happypack({
      id: 'less', //和rule中的id=less对应
      // threads--CPU核数,默认开启 CPU核数 - 1 个进程
      // threads: 5,
      //将之前 rule 中的 loader 在此配置,css中没有加入style-loader会报错
      use: ['style-loader', 'css-loader', 'less-loader'] //必须是数组
    }),
    new HardSourceWebpackPlugin(),
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {//分割代码块
      cacheGroups: {
        vendor: {
          //第三方依赖
          priority: 1, //设置优先级，首先抽离第三方模块
          name: 'vendor',
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 1 //最少引入了1次
        },
        //缓存组
        common: {
          //公共模块
          chunks: 'initial',
          name: 'common',
          minSize: 100, //大小超过100个字节
          minChunks: 3 //最少引入了3次
        }
      }
    },
    //runtimeChunk 的作用是将包含 chunk 映射关系的列表从 main.js 中抽离出来
    //在配置了 splitChunk 时，记得配置 runtimeChunk
    runtimeChunk: {
      name: 'manifest'
    }
  }
}

module.exports = smp.wrap(config);