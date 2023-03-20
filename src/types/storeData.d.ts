interface msgData {
  content:string,
  fromSelf:boolean
}

interface roomData {
  roomId: string,
  userId: string,
  msg: msgData[],
  msgUnRead: number,
  timeReceived: string
}
interface IMessage {
  id: string,
  from: string,
  to: string,
  msg: string,
  createAt: Date
}

type allRooms = roomData[]
