import { io, Socket } from 'socket.io-client'
import { getToken } from '@/util/localStorage'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000',
  {
    // reconnection: true,
    autoConnect: false,
    auth: {
      token: `Bearer ${getToken()}`
    }
  }
)
// onAny 可以讓所有server的訊息都出現在console=>production時適合
socket.onAny((event, ...args) => {
  console.log(event, args)
})
export default socket
