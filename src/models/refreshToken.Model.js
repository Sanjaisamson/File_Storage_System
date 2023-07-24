const mongoose = require('mongoose')

const refreshtokenSchema = mongoose.Schema(
    {
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

module.exports = mongoose.model("refreshTokenModel", refreshtokenSchema)