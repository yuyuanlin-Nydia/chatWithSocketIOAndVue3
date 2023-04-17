const { Schema, model } = require('mongoose')
const { ObjectId } = require('mongodb')

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
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isUnsend: {
    type: Boolean,
    default: false
  },
  bulletin: {
    isBulletin: {
      type: Boolean,
      default: false
    },
    bulletinBy: {
      type: ObjectId,
      default: null
    },
    updateAt: {
      type: Date,
      default: null
    },
  }
})
const Message = model('message', msgSchema)

module.exports = Message
