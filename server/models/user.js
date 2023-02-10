const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    account:{
      type:String,
      require:true
    },
    password:{
      type:String,
      require:true
    }
})

const User = mongoose.model('user', userSchema)
module.exports = User;