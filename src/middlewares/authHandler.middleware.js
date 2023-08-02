
const jwt = require('jsonwebtoken')
require('dotenv').config()
const httpErrors = require('http-errors')
const {RefreshTokenModel} = require('../models/refreshToken.Model')
const {UserModel} = require('../models/user.model')

async function isAuthenticated(req,res,next){
    try {
        const authHeader = req.headers['authorization'];
        const bearerLessToken = authHeader.split(' ')[1]
        const authVerify = jwt.verify(bearerLessToken, process.env.ACCESS_TOKEN_SECRET)
        const userId = authVerify.userId
        const authenticatedUser = await UserModel.findOne({_id : userId})
        req.user = authenticatedUser
        next()
    } catch (err) {
        console.log(err)
        const authError = httpErrors(401,"Unauthorized!!! authentication failed!")
        next(authError)
    }
}
async function refreshTokenVerify(req,res,next){
    try {
        const userId = req.query.userId
        const getrefreshToken = await RefreshTokenModel.findOne({userId: userId})
        const refreshToken = getrefreshToken.refreshToken
        const tokenVerify = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const accessToken = jwt.sign(
            {userId},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : '1h'}
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