import { Message } from './models/message.js'
import { User } from './models/user.js'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { connectMongoDB } from './mongoose.js'
import { userRouter } from './routes/user.js'

const app = express()
connectMongoDB()
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
  .use('/user', userRouter)

httpServer.listen(3000)

io.use((socket, next) => {
  const token = socket.handshake.auth.token.replace('Bearer ', '')
  if (token === 'null') next(new Error('token error'))
  next()
})

io.on('connection', (socket) => {
  console.log('connected')
  socket.on('authenticate', async (token, callback) => {
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
                  }
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

      const allRooms = await Message.aggregate([
        {
          $match: {
            roomID: { $regex: socket.userData._id.toString() }
          }
        },
        { $group: { _id: '$roomID' } },
        {
          $group: {
            _id: null,
            roomIDs: { $push: '$_id' }
          }
        },
        { $project: { _id: 0, roomIDs: 1 } }
      ])
      allRooms[0].roomIDs.forEach((room) => {
        socket.join(room)
      })
      socket.emit('userWithNewestMsg', userWithNewestMsg)
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
      io.to(socket.roomID).emit('currentRoomMsg', currentRoomMsg)
    } catch (err) {
      console.log(err)
    }
  })

  //   // TODO:新增群組
  //   // make all Socket instances join the "room1" room
  //   // io.socketsJoin('room1')
  //   // const sockets = await io.in('room1').fetchSockets()

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
