const mongoose = require('mongoose')
const httpErrors = require('http-errors')
const {dbConfig} = require('../config/dbConfig')

const connectDB = async () => {
    try {
        const connectionLink = `mongodb://${dbConfig.dbHost}/${dbConfig.dbName}`
        const connection = await mongoose.connect(connectionLink)
        console.log('Connected to  Database....')
        return connection
    } catch (err) {
        console.log(err)
        throw new httpErrors(403, "can't connect to the database....")
    }
}

module.exports = connectDB