const httpErrors = require('http-errors')
const userServices = require('../services/userServices')

async function getUser(req, res, next){
    try {
        const userPayload = {
           user : req.user
        }
        const userData = await userServices.readUser(userPayload)
        res.send(userData)
    } catch (err) {
        console.log(err)
        const readError = httpErrors(401,'read Failed');
        next(readError)
    }
}
async function createUser(req,res,next){
    try {
        const signupPayload = {
            username : req.body.username,
            email : req.body.email,
            password : req.body.password
        }
        const signupData = await userServices.newUser(signupPayload)
        res.send(signupData)
    } catch (err) {
        console.log(err)
        const signupError = httpErrors(401,'User Registration failed!');
        next(signupError)
    }
}

async function generateTokens(req,res,next) {
    try {
        const userId = req.query.userId
        const getToken = await userServices.generateTokens(userId)
        const refreshToken = getToken.refreshToken
        const accessToken = getToken.accessToken
        res.cookie('jwt', refreshToken, {httpOnly : true, maxAge : 24*60*60*1000});
        res.send({accessToken,refreshToken})
    } catch (err) {
        console.log(err)
        const tokenError = httpErrors(401,'Token generation failed!');
        next(tokenError)
    }
}

async function logoutUser(req, res, next){
    try {
        const logoutPayload = {
            user : req.user
        }
        const logout = await userServices.logout(logoutPayload)
        res.clearCookie('jwt')
        res.send(logout)
        next()
    } catch (err) {
        console.log(err)
        const logoutError = httpErrors(401,'logout failed!');
        next(logoutError)
    }
}


module.exports = {
    getUser,createUser,logoutUser,generateTokens
}