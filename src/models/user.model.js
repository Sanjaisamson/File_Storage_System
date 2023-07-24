const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const userDataSchema = mongoose.Schema(
    {
        _id : {
            type : String,
            default : uuidv4
        },
        name : {
            type : String,
            require:[true, "please fill the name"]
        },
        email : {
            type : String,
            require:[true, "please fill the email"]
        },
        password : {
            type : String,
            require:[true, "please fill the password"]
        }
    },{
        timestamps : true
    }
)
module.exports = mongoose.model("userData", userDataSchema)

