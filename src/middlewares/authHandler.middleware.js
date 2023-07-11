
const jwt = require('jsonwebtoken')
require('dotenv').config()
const httpErrors = require('http-errors')

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
function refreshTokenVerify(req,res,next){
    try {
        const cookie = req.cookies
        const refreshToken = cookie.jwt
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