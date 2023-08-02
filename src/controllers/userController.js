const httpErrors = require('http-errors')
const userServices = require('../services/userServices')

async function createUser(req,res,next){
    try {
        const signupPayload = {
            username : req.body.username,
            email : req.body.email,
            password : req.body.password
        }
        const signupData = await userServices.newUser(signupPayload)
        return res.send(signupData)
    } catch (err) {
        console.log(err)
        const signupError = httpErrors(401,'Unauthorized : User Registration failed!');
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
        return res.send({accessToken,refreshToken})
    } catch (err) {
        console.log(err)
        const tokenError = httpErrors(401,'Unauthorized : Token generation failed!');
        next(tokenError)
    }
}

async function logoutUser(req, res, next){
    try {
        const logoutPayload = {
            user : req.user
        }
        const logout = await userServices.logoutUser(logoutPayload)
        res.clearCookie('jwt')
        return res.send(logout)
    } catch (err) {
        console.log(err)
        const logoutError = httpErrors(401,'Unauthorized : logout failed!');
        next(logoutError)
    }
}


module.exports = {
    createUser,logoutUser,generateTokens
}