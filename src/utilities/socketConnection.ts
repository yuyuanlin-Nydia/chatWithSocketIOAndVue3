import { io, Socket } from 'socket.io-client'
import { getToken } from '@/utilities/localStorage'

const IS_PROD = process.env.NODE_ENV === 'production'
const URL = IS_PROD ? 'https://chatwithsocketioandvue3.onrender.com/' : 'http://localhost:3000'
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL,
  {
    // reconnection: true,
    autoConnect: false,
    auth: {
      token: `Bearer ${getToken()}`
    }
  }
)
// onAny 可以讓所有server的訊息都出現在console=>production時適合
// socket.onAny((event, ...args) => {
//   console.log(event, args)
// })
export default socket
