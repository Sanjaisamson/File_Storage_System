const mongoose = require('mongoose')

const userDataSchema = mongoose.Schema(
    {
        name : {
            type : String,
            require:[true, "please fill the name"]
        },
        address : {
            type : String,
            require:[true, "please fill the address"]
        },
        phoneno : {
            type : String,
            require:[true, "please fill the phone number"]
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

