
const httpErrors = require('http-errors')
const userServices = require('../services/userServices')
const bcrypt = require('bcrypt');

async function isVerified(req,res,next){
    try {
        const loginData = {
            username : req.body.username,
            password : req.body.password,
        }
        const reqPassword = loginData.password
        const userPassword = userServices.readUser().user.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(userPassword, salt)
        const isVerified = await bcrypt.compare(reqPassword, hashedPassword)
        if(isVerified){
            next()
        }else{
            throw err
        }
        
    } catch (err) {
        const loginError = httpErrors(402,'Login Failed!')
        next(loginError)
    }
}


module.exports = {
    isVerified
}