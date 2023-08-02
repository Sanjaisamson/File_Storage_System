const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const ItemSchema = mongoose.Schema(
    {
        _id : {
            type : String,
            default : uuidv4
        },
        ownerId : {
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
        ownerMailId : {
            type: String,
            require : true
        },
        parentFolder : {
            type : String,
            require : true
        },
        type : {
            type: String,
            enum : ['FOLDER', 'FILE'] ,
            default : false
        },
        extension : {
            type: String,
            require : true
        },
        storagePath : {
            type : String,
            require : true
        },
        createdDate : {
            type : Date,
            require : true
        }
    }
)

const ItemModel = mongoose.model("Item", ItemSchema) // Change table name

module.exports = {
    ItemModel
}