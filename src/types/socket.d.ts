type SocketUserData = {
  userId: string;
  userName: string;
}
type SocketPrivateMessageData = {
  content: string;
  to?: string;
  from?: string;
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newUserConnect: (value:SocketUserData)=>void
  privateMessage:(b:SocketPrivateMessageData)=>void;
  newMsgToClient:(b:any)=>void;
  allUsers:(b:any)=>void;
  updateMembers:(b:any)=>void;
  userDisconnect:(value:any)=>void
  loginStat:(value:number)=>void
}

interface ClientToServerEvents {
  joinRoom: (msg: any) => void;
  privateMessage:(b:SocketPrivateMessageData)=>void;
  chatPageEnter:(msg: any)=>void
  logInFromClient:(msg:Record<string, string>)=>void
}

interface InterServerEvents {
  ping: () => void;
  connect:(value: unknown) => void
}
