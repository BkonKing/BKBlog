const bodyParser=require("body-parser")

module.exports = {
  bodyParser: function () {
    // 解析application/json数据
    var jsonParser = bodyParser.json();
    // 解析application/x-www-form-urlencoded数据
    var urlencodedParser = bodyParser.urlencoded({ extended: false });
    return urlencodedParser
  }
}
