import { io, Socket } from 'socket.io-client'
// import { ServerToClientEvents, ClientToServerEvents } from '@/types/socket'
// 避免一開始就連接 用socket.connect()去連接
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:8181')
// onAny 可以讓所有server的訊息都出現在console=>production時適合
socket.onAny((event, ...args) => {
  console.log(event, args)
})
export default socket
