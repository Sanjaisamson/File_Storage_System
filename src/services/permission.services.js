const { PermissionModel } = require('../models/permission.model')

async function isAllowed(payload) {
    try {
        const { user, item, action } = payload
        if (user.email == item.ownerMailId) {
            return true
        }
        const response = await PermissionModel.findOne({ userMailId: user.email, itemId: item._id })
        return response?.permission.value >= action
    }
    catch (err) {
        console.log(err)
        throw new Error("Error while checking permission")
    }
}
module.exports = {
    isAllowed
}