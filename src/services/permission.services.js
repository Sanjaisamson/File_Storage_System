const permissionModel = require('../models/permission.model')
const httpErrors = require('http-errors')
const {PERMISSIONS} = require('../const/permission.const')

async function isAllowed(reqPayload){
    try {
        const {user, item , action } = reqPayload
        if (user.email == item.owner) {
            return true
        }
        const permissionCheck = await permissionModel.findOne({userMailId : user.email, itemId : item._id})
        return permissionCheck.permissionValue.p >= action
    }
     catch (err) {
        console.log(err)
    }
}
module.exports = {
    isAllowed
}