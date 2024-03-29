const { MongoServerError } = require('mongodb')
const auth = require('../jwt-auth-middleware.js')
const express = require('express')
const User = require('../models/user.js')
const userRouter = express.Router()

userRouter.post('/signup', async (req, res) => {
  try {
    // 從 req.body 獲取驗證資訊，並在資料庫存與該用戶
    const user = await User.create(req.body)
    // 為該成功註冊之用戶產生 JWT
    const token = await user.generateAuthToken()

    // 回傳該用戶資訊及 JWT
    res.send({
      success: true,
      message: {
        user,
        token
      }
    })
  } catch (err) {
    console.log(err)
    if (err instanceof MongoServerError && err.code === 11000) {
      err.message = 'Email already exists! Please change.'
    }
    res.send({
      success: false,
      error: {
        code: 1002,
        message: err.message
      }
    })
  }
})

userRouter.post('/login', async (req, res) => {
  try {
    const userData = await User.findByCredentials(req.body.email, req.body.password)
    const user = await User.findOneAndUpdate(
      { email: userData.email },
      { $set: { isOnline: 1 } }
    )
    const token = await user.generateAuthToken()
    // 回傳該用戶資訊及 JWT
    res.send({
      success: true,
      message: {
        user,
        token
      }
    })
  } catch (err) {
    console.log(err.message)
    res.send({
      success: false,
      error: {
        code: 1001,
        message: err.message
      }
    })
  }
})

userRouter.post('/logout', auth, async (req, res) => {
  try {
    // 篩選掉當前的 Token
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    // 將包含剩餘 Token 的使用者資料存回資料庫
    await req.user.save()
    res.send({ success: true, message: null })
  } catch (err) {
    res.send({
      success: false,
      error: {
        code: 1003,
        message: err.message
      }
    })
  }
})

userRouter.post('/auth', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    token ? res.send({ success: true, message: null }) : res.send({
      success: false,
      error: {
        code: 500,
        message: 'Login first to enter auth page!'
      }
    })
  } catch (err) {
    console.log(err)
  }
})

module.exports = { userRouter }