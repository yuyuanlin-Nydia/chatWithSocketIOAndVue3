const { connect } = require('mongoose')

module.exports = {
  connectMongoDB: function connectMongoDB () {
    connect(process.env.MONGO_URL, { dbName: 'messageDB' })
      .then((m) => {
        m.connection.getClient()
        console.log('Connected to MongoDB!')
      })
      .catch(err => console.log(err))
  }
}
