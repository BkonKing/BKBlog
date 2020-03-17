const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const apiMocker = require('mocker-api');
const path = require('path')
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];
const configFile = process.env.NODE_ENV === 'production' ?
  require('./dev.env') : require('./prod.env')
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  entry: './src/index.js', //webpack的默认配置
  output: {
    path: path.resolve(__dirname, 'dist'), //必须是绝对路径
    filename: 'bundle.[hash:9].js',
    publicPath: config.publicPath //通常是CDN地址,或者默认‘/'
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          // webpack.config.js 中进行babel配置，则不需要.babelrc文件
          // 如果有.babelrc文件，下面配置则不生效，尽管.babelrc为空webpack有配置也会报错
          // options: {
          //   babelrc: false,// 不采用.babelrc的配置
          //   presets: ["@babel/preset-env"],
          //   plugins: [
          //     [
          //       "@babel/plugin-transform-runtime",
          //       {
          //         "corejs": 3
          //       }
          //     ]
          //   ]
          // }
        },
        // 部分包可能会有解析不完全，ie下会报错，需要增加到include
        // include: '', //包含的文件，可以是数组
        exclude: /node_modules/
      },
      {
        test: /\.(le|c)ss$/,
        // use: [, 'css-loader', {
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev, // 开发中使用模块热替换(不然css修改页面不会刷新)
              reloadAll: true // 如果hmr不能正常工作，才能启用刷新所有。
            }
          },
          // MiniCssExtractPlugin.loader, // 单独抽离css
          /* 'style-loader', // 动态创建 style 标签，将 css 插入到 head 中，替换MiniCssExtractPlugin.loader */
          'css-loader',  // 处理 @import 等语句 
          {
            // postcss-loader和autoprefixer自动生成浏览器兼容性前缀 
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  // 在根目录下创建 .browserslistrc，将对应的规则写在此文件中，除了 autoprefixer 使用外，@babel/preset-env、stylelint、eslint-plugin-conmpat 等都可以共用。
                  require('autoprefixer')(/* {
                    "overrideBrowserslist": [
                      ">0.25%",
                      "not dead"
                    ]
                  } */)
                ]
              }
            }
          }, 'less-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 将资源转换为 base64 可以减少网络请求次数，但是 base64 数据较大，如果太多的资源是 base64，会导致加载变慢，因此设置 limit 值时，需要二者兼顾。
              //资源大小小于 10K 时，将资源转换为 base64，超过 10K，将图片拷贝到 dist 目录
              limit: 10240,
              // 设置为 false，否则，<img src={require('XXX.jpg')} /> 会出现 <img src=[Module Object] />
              esModule: false,
              // name: '[name]_[hash:6].[ext]'
              // outpath: 'assets' // 打包到同一个文件夹
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        // webpakc不识别html中img的src（本地路径不识别），需要html-withimg-loader进行解析（vue可以识别）
        // html 中就不能使用 vm, ejs 的模板了，如果想继续在 html 中使用 <% if(htmlWebpackPlugin.options.config.header) { %> 这样的语法
        // 除非这种写法，<img src="<%= require('./thor.jpeg') %>" />，并且删除html-withimg-loader的配置
        test: /.html$/,
        use: 'html-withimg-loader'
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map', //开发环境下使用
  //resolve 配置 webpack 如何寻找模块所对应的文件。
  resolve: {
    // resolve.modules 配置 webpack 去哪些目录下寻找第三方模块，默认情况下，只会去 node_modules 下寻找
    modules: ['./src/components', 'node_modules'], //从左到右依次查找
    // 通过别名把原导入路径映射成一个新的导入路径
    alias: {
      // 某个包的别名
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    },
    //配置 extensions，我们就可以缺省文件后缀，在导入语句没带文件后缀时，会自动带上extensions 中配置的后缀后，去尝试访问文件是否存在，因此要将高频的后缀放在前面，并且数组不要太长，减少尝试次数。如果没有配置 extensions，默认只会找对对应的js文件。
    // 适配多端的项目中，可能会出现 .web.js, .wx.js
    extensions: ['web.js', '.js'], //从左到右依次查找
    // enforceExtension: true, // true导入语句不能缺省文件后缀
    /**
     * 有一些第三方模块会提供多份代码，例如 bootstrap，可以查看 bootstrap 的 package.json 文件：
     * {
     *     "style": "dist/css/bootstrap.css",
     *     "sass": "scss/bootstrap.scss",
     *     "main": "dist/js/bootstrap",
     * }
     * 复制代码resolve.mainFields 默认配置是 ['browser', 'main']，即首先找对应依赖 package.json 中的 brower 字段，如果没有，找 main 字段。
     * 如：import 'bootstrap' 默认情况下，找得是对应的依赖的 package.json 的 main 字段指定的文件，即 dist/js/bootstrap。
     */
    mainFields: ['style', 'main'] // 先找style
  },
  plugins: [
    // ProvidePlugin 的作用就是不需要 import 或 require 就可以在项目中到处使用。(自动加载模块)
    // ProvidePlugin 是 webpack 的内置插件
    // 默认寻找路径是当前文件夹 ./** 和 node_modules，也可以指定全路径
    // 不过也别过度使用，毕竟全局变量不是什么“好东西”。
    new webpack.ProvidePlugin({
      // 项目启动了 eslint 的话，记得修改下 eslint 的配置文件
      /* "globals": {
          "React": true,
          "Vue": true
      } */
      // 常用库
      React: 'react',
      Component: ['react', 'Component'],
      // Vue 的配置后面多了一个 default，这是因为 vue.esm.js 中使用的是 export default 导出的，对于这种，必须要指定 default。React 使用的是 module.exports 导出的，因此不要写 default。
      // 对于 ES2015 模块的 default export，你必须指定模块的 default 属性。
      Vue: ['vue/dist/vue.esm.js', 'default'],
      $: 'jquery',
      jQuery: 'jquery',
      _map: ['lodash', 'map'] // lodash的map,第一个为模块，后面模块包含的方法
    }),
    // 抽离css
    new MiniCssExtractPlugin({
      filename: 'css/[name].css' //个人习惯将css文件放在单独目录下
    }),
    // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
    // new webpack.NoEmitOnErrorsPlugin(),
    // 定义环境变量
    // DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。这就是 DefinePlugin 的用处，设置它，就可以忘记开发和发布构建的规则。
    // 不同环境的全局配置变量定义
    // DefinePlugin 中的每个键，是一个标识符.
    // 如果 value 是一个字符串，会被当做 code 片段
    // 如果 value 不是一个字符串，会被stringify
    // 如果 value 是一个对象，正常对象定义即可
    // 如果 key 中有 typeof，它只针对 typeof 调用定义
    new webpack.DefinePlugin({
      'process.env': configFile, // 读取文件配置
      DEV: JSON.stringify('dev'), //字符串
      FLAG: 'true' //FLAG 是个布尔类型
    })
  ]
}
