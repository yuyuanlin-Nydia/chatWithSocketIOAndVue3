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
                  sendAt: '$sendAt'
                }
              }
            ],
            as: 'latestMsgArr'
          }
        },
        {
          $project: {
            password: 0,
            tokens: 0,
            registerDate: 0
          }
        },
        {
          $sort: { 'latestMsgArr.sendAt': -1 }
        }
      ])
      const sortedIds = [socket.userData._id.toString(), userWithNewestMsg[0]._id.toString()].sort((a, b) => a.localeCompare(b))
      socket.roomID = sortedIds.join('-')
      await socket.join(socket.roomID)
      const currentRoomMsg = await Message.find({
        roomID: socket.roomID
      })
      socket.emit('userWithNewestMsg', userWithNewestMsg)
      socket.emit('currentRoomMsg', currentRoomMsg)
    } catch (err) {
      console.log(err)
    }
  })
  socket.on('changeRoom', async (roomID) => {
    try {
      socket.leave(socket.roomID)
      socket.roomID = roomID
      socket.join(socket.roomID)
      const currentRoomMsg = await Message.find(
        {
          roomID: socket.roomID
        }
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
      io.to(msgData.roomID).emit('newMsgToClient', result)
    } catch (err) {
      console.log(err)
    }
  })

  socket.on('disconnect', async () => {
    try {
      socket.leave(socket.roomID)
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
