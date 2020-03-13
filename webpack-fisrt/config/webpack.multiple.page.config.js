const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:6].js'
    },
    //如果需要配置多个 HtmlWebpackPlugin，那么 filename 字段不可缺省，否则默认生成的都是 index.html
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.[hash:6].html', //打包后的文件名
            chunks: ['index'] //接受一个数组，配置此参数仅会将数组中指定的js引入到html文件中
            // excludeChunks: [] //接受一个数组，需要引入多个JS文件，仅有少数不想引入
        }),
        new HtmlWebpackPlugin({
            template: './public/login.html',
            filename: 'login.[hash:6].html', //打包后的文件名
            chunks: ['login']
        }),
    ]
}