const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const userSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4
        },
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true
    }
)
const UserModel = mongoose.model("user", userSchema)

module.exports = { UserModel }
