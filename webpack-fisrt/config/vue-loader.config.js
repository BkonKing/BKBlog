'use strict'
// https://vue-loader.vuejs.org/zh/
// 需要安装npm install -D vue-loader vue-template-compiler
const isProduction = process.env.NODE_ENV === 'production'
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

function cssLoaders(options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
        publicPath: '../../'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// 为独立样式文件生成加载程序 (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: cssLoaders({
            sourceMap: !isProduction,
            extract: isProduction
          }),
          cssSourceMap: !isProduction,
          cacheBusting: false,
          /* 热重载默认是开启的，除非遇到以下情况：
              webpack 的 target 的值是 node (服务端渲染)
              webpack 会压缩代码
              process.env.NODE_ENV === 'production' */
          hotReload: false, // 关闭热重载
          // 处理资源路径
          // 当 Vue Loader 编译单文件组件中的 <template> 块时，它也会将所有遇到的资源 URL 转换为 webpack 模块请求。
          // 默认下列标签/特性的组合会被转换
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: ['xlink:href', 'href'],
            use: ['xlink:href', 'href']
          }
        }
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件！它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。
    new VueLoaderPlugin()
  ]
}