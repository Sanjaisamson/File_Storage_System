const permissionModel = require('../models/permission.model')
const httpErrors = require('http-errors')
const {PERMISSIONS} = require('../const/permission.const')

async function isAllowed(reqPayload){
    try {
        const {userMailId, itemId, action } = reqPayload
        console.log(action)
        const permissionCheck = await permissionModel.findOne({userMailId : userMailId, itemId : itemId})
        return permissionCheck.permissionValue.p >= action
    }
     catch (err) {
        console.log(err)
        const permissionError = httpErrors(402,'Failed To check permission')
    }
}
module.exports = {
    isAllowed
}