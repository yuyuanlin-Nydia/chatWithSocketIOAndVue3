const path = require('path')
const dotenv = require('dotenv')
const User = require('./models/user')
const Message = require('./models/message')
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { connectMongoDB } = require('./db')
const mongoose = require('mongoose')
const { userRouter } = require('./routes/user')
const app = express()

dotenv.config()
connectMongoDB()
const httpServer = createServer(app)
// 前端的http request會跨域
const io = new Server(httpServer, {
  cors: { origin: '*' }
})
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}
const port = process.env.PORT || 3000
app
  .use(cors(corsOptions))
  .use(express.json())
  .use('/user', userRouter)

const __dirname1 = path.resolve()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '/dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, 'dist', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('success')
  })
}
httpServer.listen(port)

io.use((socket, next) => {
  const token = socket.handshake.auth.token?.replace('Bearer ', '')
  if (token === 'null') next(new Error('token error'))
  next()
})

io.on('connection', (socket) => {
  console.log('connected')
  socket.once('authenticate', async (token, callback) => {
    try {
      socket.token = token
      socket.userData = await User.findOneAndUpdate(
        { tokens: { $elemMatch: { token } } },
        { $set: { isOnline: 1 } }
      )
      if (!socket.userData) {
        throw new Error('Token not found!')
      }
      callback({ success: true })
      socket.broadcast.emit('newUserConnect', socket.userData)

      const userWithNewestMsg = await User.aggregate([
        {
          $match: {
            _id: {
              $ne: socket.userData._id
            }
          }
        },
        {
          $lookup: {
            from: 'messages',
            let: {
              userId: '$_id'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ['$from', ['$$userId', socket.userData._id]] },
                      { $in: ['$to', ['$$userId', socket.userData._id]] }
                    ]
                  },
                  isUnsend: false
                }
              },
              { $sort: { sendAt: -1 } },
              { $limit: 1 },
              {
                $project: {
                  _id: 0,
                  from: '$from',
                  to: '$to',
                  msg: '$msg',
                  sendAt: '$sendAt',
                  roomID: '$roomID'
                }
              }
            ],
            as: 'latestMsg'
          }
        },
        {
          $lookup: {
            from: 'messages',
            let: { latestMsgRoomID: '$latestMsg.roomID' },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ['$roomID', '$$latestMsgRoomID'] },
                  isRead: false,
                  isUnsend: false,
                  to: socket.userData._id
                }
              },
              { $count: 'unReadMsgAmount' }
            ],
            as: 'unReadMsgAmount'
          }
        },
        {
          $addFields: {
            latestMsg: {
              $cond: {
                if: { $gt: [{ $size: '$latestMsg' }, 0] },
                then: { $arrayElemAt: ['$latestMsg', 0] },
                else: null
              }
            },
            unReadMsgAmount: {
              $cond: {
                if: { $gt: [{ $size: '$unReadMsgAmount' }, 0] },
                then: { $arrayElemAt: ['$unReadMsgAmount.unReadMsgAmount', 0] },
                else: 0
              }
            }
          }
        },
        {
          $project: {
            password: 0,
            tokens: 0,
            registerDate: 0
          }
        },
        { $sort: { 'latestMsg.sendAt': -1 } }
      ])
      socket.emit('userWithNewestMsg', userWithNewestMsg)
      // 先加入所有房間 才能接收到未讀訊息
      userWithNewestMsg.forEach(user => {
        const roomID = [socket.userData._id, user._id.toString()].sort((a, b) => a.localeCompare(b)).join('-')
        socket.join(roomID)
      })
    } catch (err) {
      console.log(err)
    }
  })
  
  socket.on('joinRoom', (roomID) => {
    try {
      socket.join(roomID)
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('changeRoom', async (roomID) => {
    try {
      socket.roomID = roomID
      const currentRoomMsg = await Message.find(
        { roomID: socket.roomID }
      )
      const currentRoomBulletin = await Message.aggregate(
        [
          {
            $match: {
              roomID: socket.roomID,
              'bulletin.isBulletin': true
            }
          },
          { $sort: { 'bulletin.updateAt': -1 } },
          {
            $lookup: {
              from: 'users',
              localField: 'bulletin.bulletinBy',
              foreignField: '_id',
              as: 'user'
            }
          },
          { $unwind: '$user' },
          {
            $project: {
              msg: '$msg',
              bulletinBy: '$user.userName',
              bulletinAt: '$msg.bulletin.updateAt'
            }
          }
        ]
      )
      io.to(socket.roomID).emit('currentRoomMsg', currentRoomMsg, currentRoomBulletin)
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('privateMessage', async (msgData) => {
    try {
      const result = await Message.create(msgData)
      io.to(msgData.roomID).emit('newMsgToClient', result) // 聊天室所有人 => 更新詳細訊息
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('updateMsgWithRead', async () => {
    try {
      await Message.updateMany(
        { roomID: socket.roomID },
        { $set: { isRead: true } }
      )
      socket.to(socket.roomID).emit('updateMsgWithReadSuccess')
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('unsendMsg', async (msgID) => {
    try {
      const result = await Message.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(msgID) },
        { $set: { isUnsend: true } }
      )
      io.to(result.roomID).emit('unsendMsgSuccess', result)
      socket.to(result.roomID).emit('updateRoomWithUnreadAmount', result)
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('addBulletin', async (msgID) => {
    try {
      console.log('addBulletin')
      await Message.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(msgID) },
        {
          $set: {
            'bulletin.isBulletin': true,
            'bulletin.bulletinBy': socket.userData._id,
            'bulletin.updateAt': Date.now()
          }
        }
      )
      const result = await Message.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(msgID) } },
        {
          $lookup: {
            from: 'users',
            localField: 'bulletin.bulletinBy',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            msg: '$msg',
            bulletinBy: '$user.userName'
          }
        }
      ])
      io.to(socket.roomID).emit('addBulletinSuccess', result[0])
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('cancelBulletin', async (msgID, userID) => {
    try {
      const result = await Message.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(msgID) },
        {
          $set: {
            bulletin: {
              isBulletin: false,
              bulletinBy: null
            }
          }
        },
        { new: true }
      )
      io.to(result.roomID).emit('cancelBulletinSuccess', msgID)
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('disconnect', async () => {
    try {
      const result = await User.findOneAndUpdate(
        { email: socket.userData?.email },
        { $set: { isOnline: 0 } }
      ).catch(err =>
        console.error(`Failed to find and update document: ${err}`)
      )
      if (result) {
        socket.broadcast.emit('userDisconnect', result)
      }
    } catch (err) {
      console.log(err)
    }
  })
})
