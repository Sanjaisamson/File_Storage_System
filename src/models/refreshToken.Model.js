const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const refreshtokenSchema = mongoose.Schema(
    {
        _id : {
            type : String,
            default : uuidv4
        },
        userId : {
            type : mongoose.Schema.Types.String,
            ref :"userData"
        },
        refreshToken : {
            type : String,
            require : true
        }
    }
)

const RefreshTokenModel = mongoose.model("refreshToken", refreshtokenSchema)

module.exports = { RefreshTokenModel }