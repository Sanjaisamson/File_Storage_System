const { json } = require('body-parser');
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const permissionSchema = mongoose.Schema(
    {
        _id : {
            type : String,
            default : uuidv4
        },
        itemId : {
            type : mongoose.Schema.Types.String,
            ref : "filesDataModel",
            require: true
        },
        userMailId : {
            type : mongoose.Schema.Types.String,
            ref : "usersData",
            require : true
        },
        permissionValue : {
            p : {type : String,require :true},
        }
    }
)

module.exports = mongoose.model("permissionModel", permissionSchema)