const httpErrors = require('http-errors')
const userServices = require('../services/userServices')
const userModel = require('../models/user.model')
const refreshTokenModel = require('../models/refreshToken.Model')

async function getUser(req, res, next){
    try {
        const payload = {
            _id : req.params.id
        }
        const userData = await userServices.readUser(payload)
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
            address : req.body.address,
            phone_no : req.body.phone_no,
            password : req.body.password
        }
        const signupData = await userServices.newUser(signupPayload)
    } catch (err) {
        console.log(err)
        const signupError = httpErrors(401,'User Registration failed!');
        next(signupError)
    }
}

async function generateTokens(req,res,next) {
    try {
        
        const userId = req.params.id
        const getToken = await userServices.generateTokens(userId)
        const refreshToken = getToken.refreshToken
        const accessToken = getToken.accessToken
        res.cookie('jwt', refreshToken, {httpOnly : true, maxAge : 24*60*60*1000});
        const find_user = await refreshTokenModel.findOne({userId})
        if(!find_user){
            const saveToken = await new refreshTokenModel({
                userId : userId,
                refreshToken : refreshToken,
            })
            console.log("the user not existed so created")
            await saveToken.save();
        }else{
            const saveNewToken = await refreshTokenModel.findOneAndUpdate(
                {userId : userId },
                {refreshToken : refreshToken },
                {upsert: true, new: true}
            )
            console.log("the user is existed so token is replaced")
            await saveNewToken.save();
        }
        res.send({accessToken,refreshToken})
    } catch (err) {
        console.log(err)
        const tokenError = httpErrors(401,'Token generation failed!');
        next(tokenError)
    }
}

async function updateUser(req, res, next){
    try {
        const userId = req.params.id
        const updateData = {
            id : req.params.id,
            requestPayload : req.body
        }
    const updatedUser = await userServices.update(updateData)
    res.send(updatedUser)
    next()
    } catch (err) {
        console.log(err)
        const updateError = httpErrors(404,"updation invalid!")
        next(updateError)
    }
}

function logoutUser(){
    
}


module.exports = {
    getUser,createUser,updateUser,logoutUser,generateTokens
}