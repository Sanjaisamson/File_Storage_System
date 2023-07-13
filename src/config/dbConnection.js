const mongoose = require('mongoose')
const httpErrors = require('http-errors')

const connectDB = async () =>{
    try {
        const connection  = await mongoose.connect("mongodb://127.0.0.1/file_storage_system")
        console.log('Connected to MongoDB...')
    } catch (err) {
        console.log(err)
        console.log("couldn't  connect to db")
    }
}

module.exports = connectDB