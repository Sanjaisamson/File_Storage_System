const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const itemDataSchema = mongoose.Schema(
    {
        _id : {
            type : String,
            default : uuidv4
        },
        userId : {
            type : mongoose.Schema.Types.String,
            ref :"userData"
        },
        name : {
            type : String,
            require : true
        },
        size : {
            type : Number,
            require : true
        },
        owner : {
            type: String,
            require : true
        },
        parentFolder : {
            type : String,
            require : true
        },
        type : {
            type: String,
            enum : ['FOLDER', 'FILES'] ,
            default : false
        },
        extension : {
            type: String,
            require : true
        },
        StoragePath : {
            type : String,
            require : true
        },
        createdDate : {
            type : Date,
            require : true
        }
    }
)

module.exports = mongoose.model("itemDataModel", itemDataSchema)