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
        permission : {
            value : {type : String,require :true},
        }
    }
)

const PermissionModel = mongoose.model("permissions", permissionSchema)

module.exports = {
    PermissionModel
}