const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin
const bodyParser = require('../middlewares/bodyParser').bodyParser

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.json(200, { data: 'message' })
  // res.send('登录页')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  console.log(req.body);
  res.json(200, { data: 'message' })
})

module.exports = router