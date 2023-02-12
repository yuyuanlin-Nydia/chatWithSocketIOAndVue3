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

type allRooms = roomData[]
