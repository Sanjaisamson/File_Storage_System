
const httpErrors = require('http-errors')
const userServices = require('../services/userServices')
const bcrypt = require('bcrypt');
const {UserModel} = require('../models/user.model')

async function isVerified(req,res,next){
    try {
        const userId = req.query.userId
        const username = req.body.username
        const password =req.body.password

        const user = await UserModel.findOne({_id: userId})
        console.log(user.password)
        console.log(password)
        const isVerified = await bcrypt.compare(password, user.password)
        if(isVerified){
            next()
        }else{
            throw new Error("password error")
        }
    } catch (err) {
        console.log(err)
        const loginError = httpErrors(401, "Username Or Password is incorrect!!!")
        next(loginError)
    }
}


module.exports = {
    isVerified
}