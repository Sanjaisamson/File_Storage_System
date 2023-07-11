const httpErrors = require('http-errors')
const userServices = require('../services/userServices')

async function getUser(req, res, next){
    try {
        const userData = await userServices.readUser()
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
            password : req.body.password,
            email : req.body.email
        }
        const signupData = await userServices.newUser(signupPayload)
        const refreshToken = signupData.refreshToken
        const accessToken = signupData.accessToken
        res.cookie('jwt', refreshToken, {httpOnly : true, maxAge : 24*60*60*1000});
        res.send({accessToken,refreshToken})
        res.send("user registered successfully")
    } catch (err) {
        console.log(err)
        const signupError = httpErrors(401,'User Registration failed!');
        next(signupError)
    }
}

function loginUser(){
    
}

function logoutUser(){
    
}


module.exports = {
    getUser,createUser,loginUser,logoutUser
}