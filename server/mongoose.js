const { connect } = require('mongoose')

const mongoDBUrl = 'mongodb+srv://sandy6513a:rdtest1153@cluster0.sczfsqy.mongodb.net/?retryWrites=true'
module.exports = {
  connectMongoDB: function connectMongoDB () {
    connect(mongoDBUrl, { dbName: 'messageDB' })
      .then((m) => {
        m.connection.getClient()
        console.log('Connected to MongoDB!')
      })
      .catch(err => console.log(err))
  }
}
