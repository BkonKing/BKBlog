// vue.config.js
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  // 配置scss共享全局变量
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/var.scss";`
      }
    }
  },
  // configureWebpack: {
  //   name: name,
  //   resolve: {
  //     alias: {
  //       '@': resolve('src')
  //     }
  //   }
  // },
  configureWebpack: config => {
    config.resolve.alias['@'] = resolve('src')
    // config.resolve.alias.set('@', resolve('/src'))
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
    // 这里是对环境的配置，不同环境对应不同的BASE_URL，以便axios的请求地址不同
    config.plugin('define').tap(args => {
      // console.log(args);
      args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL)
      return args
    })
  }
  // devServer: {
  //   // 端口
  //   port: 3000,

  //   // 配置代理
  //   proxy: {
  //     '^/api': {
  //       target: 'http://localhost:8081',
  //       ws: true,
  //       changeOrigin: true
  //     },
  //     '^/data': {
  //       target: 'http://localhost:3000'
  //     }
  //   },
  //   before (app) {
  //     app.get('/api/getUser', (req, res, next) => {
  //       res.json(mockData)
  //     })
  //   }
  // }
}
