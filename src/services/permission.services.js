const {PermissionModel } = require('../models/permission.model')
const httpErrors = require('http-errors')

async function isAllowed(reqPayload){
    try {
        const {user, item , action } = reqPayload
        if (user.email == item.ownerMailId) {
            return true
        }
        const permissionCheck = await PermissionModel.findOne({userMailId : user.email, itemId : item._id})
        return permissionCheck.permission.value >= action
    }
     catch (err) {
        console.log(err)
        throw httpErrors(401, "Unauthorized user !!! permission denied")
    }
}
module.exports = {
    isAllowed
}