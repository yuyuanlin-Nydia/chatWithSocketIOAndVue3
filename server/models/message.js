import { Schema, model } from 'mongoose'
import { ObjectId } from 'mongodb'

const msgSchema = new Schema({
  roomID: {
    type: String,
    require: true
  },
  from: {
    type: ObjectId,
    require: true
  },
  to: {
    type: ObjectId,
    require: true
  },
  msg: {
    type: String,
    require: true
  },
  sendAt: {
    type: Date,
    default: Date.now
  }
})

export const Message = model('message', msgSchema)
