const mongoose = require('mongoose')
const msgSchema = new mongoose.Schema({
    content:{
      type:String,
      require:true
    },
    from:{
      type:String,
      require:true
    },
    to:{
      type:String,
      require:true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    readStatus:{
      type:Number,
      default:0
    }
})

const Msg = mongoose.model('msg', msgSchema)
module.exports = Msg;