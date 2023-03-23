type SocketUserData = {
  userId: string;
  userName: string;
}
type SocketPrivateMessageData = {
  msg: string;
  to: string;
  from: string;
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newUserConnect: (value:SocketUserData)=>void
  privateMessage:(b: SocketPrivateMessageData)=>void;
  newMsgToClient:(b: any)=>void;
  userWithNewestMsg:(b: any)=>void;
  updateMembers:(b: any)=>void;
  userDisconnect:(value: any)=>void
  loginStat:(value: number)=>void,
  currentUserMsg:(msg: IMessage[])=>void
}
interface IAuthenticateCb {
  (message: {success: boolean}): void;
}
interface ClientToServerEvents {
  joinRoom: (msg: any) => void;
  privateMessage:(b: SocketPrivateMessageData)=>void;
  changeRoom:(msg: any)=> void,
  authenticate:(req: {token: string}, callback: IAuthenticateCb)=> void,
}

interface InterServerEvents {
  ping: () => void;
  connect:(value: unknown) => void
}
