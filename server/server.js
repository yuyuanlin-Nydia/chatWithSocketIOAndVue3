//See https://github.com/elad/node-cluster-socket.io
//DB
const mongoogse = require('mongoose');
const Msg = require('./models/message')
const User = require('./models/user')
const mongoDB= 'mongodb+srv://sandy6513a:sandy6513a@cluster0.sczfsqy.mongodb.net/messageDB?retryWrites=true&w=majority'
mongoogse.connect(mongoDB).then(()=>{
  console.log('connected')
}).catch(err=>console.log(err))
// express
const express = require("express");
const app = express();
//http
const http = require("http");
const server = http.createServer(app);
// socketIO
const socketIO = require("socket.io");
const { isGeneratorFunction } = require('util/types');
//cors設定是必要的，前端的http request會跨域
const io = socketIO(server, {
    cors: {
      origin: "http://localhost:8080",
    }
});
const port = 8181;
server.listen(port, () => {
	console.log("listening on *:8181");
});

//塞Token的地方?
// io.use((socket, next) => {
//   const {account, password} = socket.handshake.auth;
//   if (!account || !password) {
//     return next(new Error("invalid username"));
//   }

//   socket.userName = account;
//   socket.password = password;
//   next();
// });

io.on('connection', async(socket) =>{
  const users = [{userId:'56002',userName:"Group",msg:[],connected:false}];
  console.log(`connected`);
  socket.join('56002');//近來一律加入群組裡
  for (let [id, socket] of io.of("/").sockets) {
    console.log(socket.userName)
    users.push({
        userId: id,
        userName: socket.userName,
        msg:[],
        connected: true,
    });
  }
    socket.emit('users', users);

  socket.broadcast.emit('userConnected', {
    userId: socket.id,
    userName: socket.userName,
    msg:[],
    connected:true
  })
  socket.on('logInFromClient',(data)=>{
    User.find(data).then(result=>{
      const logInSuccess =result.length?  1:0 
      socket.emit('loginStat', logInSuccess);
    });
  })
  socket.on('chatPageEnter',()=>{
    socket.emit('users', users);
  })
  socket.on('privateMessage', ({ content, to })=>{
    const msg = {
      content,
      from: socket.id,
      to
    };
    const messageData = new Msg(msg)
    messageData.save().then(()=>{
      socket.to(to).to(socket.id).emit("newMsgToClient", msg);
    })
  })


  socket.on("disconnect",  () => {
      // notify other users
      console.log(socket.id)
      socket.broadcast.emit("userDisconnected", socket.id);
      // update the connection status of the session
      users.forEach((user)=>{
        if(user.userId===socket.id){
          user.connected=false  
        }
      })
  });
});
