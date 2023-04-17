const { ObjectId } = import('mongodb')

type bulletinObj = {
  isBulletin: boolean,
  bulletinBy: null | ObjectId,
  updateAt: string
}

interface IBulletin {
  _id: string,
  msg: string,
  bulletinBy: string
}

interface IMessage {
  _id: string,
  roomID: string,
  from: string,
  to: string,
  msg: string,
  sendAt: string,
  isUnsend: boolean,
  isRead: boolean,
  bulletin: bulletinObj
}

type IBulletin = Pick<IMessage, '_id' | 'msg'> & { bulletinBy: string }
