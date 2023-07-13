
const httpErrors = require('http-errors')
const userServices = require('../services/userServices')
const bcrypt = require('bcrypt');
const userData = require('../models/user.model')

async function isVerified(req,res,next){
    try {
        const loginData = {
            userId : req.params.id,
            username : req.body.username,
            password : req.body.password,
        }
        const reqPassword = loginData.password
        const _id = loginData.userId
        console.log(_id)
        const user = await userData.findOne({_id})
        //console.log({savedPassword})
        const userPassword = user.password
        console.log(userPassword)
        const isVerified = await bcrypt.compare(reqPassword, userPassword)
        console.log(isVerified)
        if(isVerified){
            next()
        }else{
            console.log("password error")
        }  
    } catch (err) {
        console.log(err)
        const loginError = httpErrors(402,'Login Failed!')
        next(loginError)
    }
}


module.exports = {
    isVerified
}