import { Schema, model } from 'mongoose'
const msgSchema = new Schema({
  content: {
    type: String,
    require: true
  },
  from: {
    type: String,
    require: true
  },
  to: {
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  readStatus: {
    type: Number,
    default: 0
  }
})

export default model('msg', msgSchema)
