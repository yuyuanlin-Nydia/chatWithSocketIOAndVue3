import { Message } from './models/message.js'
import { User } from './models/user.js'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { connectMongoDB } from './mongoose.js'
import { userRouter } from './routes/user.js'
import { messageRouter } from './routes/message.js'

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
  .use('/message', messageRouter)

httpServer.listen(3000)

io.use((socket, next) => {
  const token = socket.handshake.auth.token.replace('Bearer ', '')
  if (token === 'null') next(new Error('token error'))
  next()
})

io.on('connection', (socket) => {
  console.log('connected')
  socket.on('authenticate', async ({ token }, callback) => {
    try {
      socket.userData = await User.findOne({ tokens: { $elemMatch: { token } } })
      socket.token = token
      socket.userData = await User.findOneAndUpdate(
        { email: socket.userData?.email },
        { $set: { isOnline: 1 } }
      )
      if (!socket.userData) {
        throw new Error('Token not found!')
      }
      callback({ success: true })
      const userWithNewestMsg = await User.aggregate([
        {
          $match: {
            _id: {
              $ne: socket.userData?._id
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
                  latest: '$msg',
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
      const currentUserMsg = await Message.find(
        {
          from: { $in: [socket.userData._id, userWithNewestMsg[0]._id] },
          to: { $in: [socket.userData._id, userWithNewestMsg[0]._id] }
        })
      socket.emit('userWithNewestMsg', { userWithNewestMsg })
      socket.emit('currentUserMsg', currentUserMsg)
      socket.broadcast.emit('newUserConnect', socket.userData)
    } catch (err) {
      console.log(err)
    }
  })
  socket.on('changeRoom', async (userData) => {
    const currentUserMsg = await Message.find(
      {
        from: { $in: [socket.userData._id, userData._id] },
        to: { $in: [socket.userData._id, userData._id] }
      }
    )
    socket.emit('currentUserMsg', currentUserMsg)
  })

  //   // TODO:新增群組
  //   // make all Socket instances join the "room1" room
  //   // io.socketsJoin('room1')
  //   // const sockets = await io.in('room1').fetchSockets()

  // socket.on('privateMessage', ({ msg, to, from }) => {
  //   const messageData = new Msg(msg)
  //   messageData.save().then(() => {
  //     socket.to(to).to(socket.id).emit('newMsgToClient', msg)
  //   })
  // })

  socket.on('disconnect', async () => {
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
