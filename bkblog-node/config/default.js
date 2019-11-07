//mysql配置文件
let mysql = {
  host: "116.62.16.88",
  post: 3306,
  user: "root",
  password: "root", //用户密码 ，如果你没有密码，直接双引号就是
  database: "mysql" //数据库名字
}

//用module.exports暴露出这个接口
module.exports = {
  port: 3000,
  session: {
    secret: 'bkblog',
    key: 'bkblog',
    maxAge: 2592000000
  },
  mysql: mysql
}