const permissionModel = require('../models/permission.model')
const httpErrors = require('http-errors')
const accessServices = require('./access.services')
const permissionConst = require('../const/permission.const')
async function isPermissionClear(req,res,next){
    try {
        const userMailId = req.body.userMailId
        const itemId = req.body.itemId
        const permissionCheck = await permissionModel.findOne({userMailId : userMailId, itemId : itemId})
        if(permissionCheck.permissionValue.p >= permissionConst.delete){
            const _rwx_ = true
            return (_rwx_)
        }else if(permissionCheck.permissionValue.p <= permissionConst.write){
            const _rw_ = true
            return(_rw_)
        }else if(permissionCheck.permissionValue.p = permissionConst.read){
            const _r_ = true
            return(_r_)
        }else{
            res.send('sorry you have no permission to access this file!')
        }
        next()
    }
     catch (err) {
        console.log(err)
        const permissionError = httpErrors(402,'Failed To check permission')
        next(permissionError)
    }
}

module.exports = {
    isPermissionClear
}