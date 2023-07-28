
const httpErrors = require('http-errors')
const userServices = require('../services/userServices')
const bcrypt = require('bcrypt');
const userData = require('../models/user.model')

async function isVerified(req,res,next){
    try {
        const  userId = req.query.userId
        const username = req.body.username
        const password =req.body.password

        const user = await userData.findOne({_id: userId})
        const isVerified = await bcrypt.compare(password, user.password)
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