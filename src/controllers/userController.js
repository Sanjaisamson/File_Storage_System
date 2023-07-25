const httpErrors = require('http-errors')
const userServices = require('../services/userServices')
const authhandler = require('../middlewares/authHandler.middleware')

async function getUser(req, res, next){
    try {
        console.log(req.user)
        const userPayload = req.user
        const userData = await userServices.readUser(userId)
        res.send({userData})
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
        console.log(req.params)
        const userId = req.params.id
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

function logoutUser(){
    
}


module.exports = {
    getUser,createUser,logoutUser,generateTokens
}