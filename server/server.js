import Msg from './models/message.js'
import User from './models/user.js'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { connect } from 'mongoose'
import auth from './jwt-auth-middleware.js'
import cors from 'cors'

const mongoDBUrl = 'mongodb+srv://sandy6513a:rdtest1153@cluster0.sczfsqy.mongodb.net/?retryWrites=true&w=majority'
const app = express()
connect(mongoDBUrl, { dbName: 'messageDB' })
  .then((m) => {
    m.connection.getClient()
    console.log('Connected to MongoDB!')
  })
  .catch(err => console.log(err))

const httpServer = createServer(app)
// 前端的http request會跨域
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:8080'
  }
})
const corsOptions = {
  origin: '*',
  // origin: 'http://localhost:8080',
  // credentials: false
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}

app
  .use(cors(corsOptions))
  .use(express.json())

httpServer.listen(3000)
app.post('/signup', async (req, res) => {
  try {
    // 從 req.body 獲取驗證資訊，並在資料庫存與該用戶
    const user = await User.create(req.body)
    // 為該成功註冊之用戶產生 JWT
    const token = await user.generateAuthToken()
    // 回傳該用戶資訊及 JWT
    res.status(201).send({ user, token })
  } catch (err) {
    res.status(400).send(err)
  }
})

app.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const userUpdated = await User.findOneAndUpdate(
      { email: user.email },
      { $set: { isOnline: 1 } }
    )
    const token = await user.generateAuthToken()
    // 回傳該用戶資訊及 JWT
    res.send({ userUpdated, token })
  } catch (err) {
    res.status(400).send('404')
  }
})

app.post('/logout', auth, async (req, res) => {
  try {
    // 篩選掉當前的 Token
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    // 將包含剩餘 Token 的使用者資料存回資料庫
    await req.user.save()
    res.status(200).send('success')
  } catch (err) {
    res.status(500).send('logout')
  }
})

app.post('/auth', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    token === 'null' ? res.send(false) : res.send(true)
  } catch (err) {
    console.log(err)
  }
})
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token.replace('Bearer ', '')
  socket.token = token
  console.log(token)
  if (token === 'null') next(new Error('token error'))
  next()
})

io.on('connection', async (socket) => {
  console.log('connected')
  socket.on('chatPageEnter', async (name) => {
    socket.userData = await User.findOne({ 'tokens.token': socket.token })
    const allUsers = await User.find({ email: { $ne: socket.userData?.email } }).sort({ registerDate: -1 })
    console.log(socket.userData)
    socket.emit('allUsers', allUsers)
    socket.broadcast.emit('newUserConnect', socket.userData)
  })

  //   // TODO:新增群組
  //   // make all Socket instances join the "room1" room
  //   // io.socketsJoin('room1')
  //   // const sockets = await io.in('room1').fetchSockets()

  //   socket.on('privateMessage', ({ content, to }) => {
  //     const msg = {
  //       content,
  //       from: socket.id,
  //       to
  //     }
  //     const messageData = new Msg(msg)
  //     messageData.save().then(() => {
  //       socket.to(to).to(socket.id).emit('newMsgToClient', msg)
  //     })
  //   })

  socket.on('disconnect', async () => {
    console.log('disconnect')
    // update the connection status
    const result = await User.findOneAndUpdate(
      { email: socket.userData?.email },
      { $set: { isOnline: 0 } }
    ).catch(err =>
      console.error(`Failed to find and update document: ${err}`)
    )

    if (result) {
      socket.broadcast.emit('userDisconnect', result)
    }
  })
})
