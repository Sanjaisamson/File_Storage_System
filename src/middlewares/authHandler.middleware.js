
const jwt = require('jsonwebtoken')
require('dotenv').config()
const httpErrors = require('http-errors')
const refreshTokenModel = require('../models/refreshToken.Model')

function isAuthenticated(req,res,next){
    try {
        const authHeader = req.headers['authorization'];
        const bearerLessToken = authHeader.split(' ')[1]
        const authVerify = jwt.verify(bearerLessToken, process.env.ACCESS_TOKEN_SECRET)
        next()
    } catch (err) {
        console.log(err)
        const authError = httpErrors(402,"authentication failed!")
        next(authError)
    }
     
}
async function refreshTokenVerify(req,res,next){
    try {
        const userId = req.params.id
        console.log(userId)
        //const cookie = req.cookies
        const getrefreshToken = await refreshTokenModel.find({userId},{userId:0,_id:0,__v:0})
        console.log(getrefreshToken)
        const refreshToken = getrefreshToken.refreshToken
        const tokenVerify = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const accessToken = jwt.sign(
            {tokenVerify},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : '30s'}
        )
        res.json({accessToken})
    } catch (err) {
        console.log(err)
        const refreshTokenError = httpErrors(402,"refreshToken not match!")
        next(refreshTokenError)
    }
}

module.exports = {
    isAuthenticated, refreshTokenVerify
}