const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model')
const itemModel = require('../models/items.model')
const refreshTokenModel = require('../models/refreshToken.Model')
const itemServices = require('../services/items.services')

async function readUser(payload){
    try {
        const {user} = payload
        console.log(user)
        const rootFolder = await itemModel.findOne({owner : user.email, parentFolder : null})
        const children = await itemModel.find({parentFolder : rootFolder._id})
        const responseObject = {
            rootFolder: rootFolder,
            content : children 
        }
        return(responseObject)
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function newUser(signupData){
    try {
        const {username, email,  password } = signupData
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const find_user = await userModel.findOne({email})
        if(!find_user){
            const userData = await userModel.create({
                name : username,
                email : email,
                password : hashedPassword
            })
            const userId = userData._id
            console.log(userId)
            const RootFolder = await itemServices.createRootFolder(userId)
            return {userData,RootFolder}
        }
        throw new Error("sorry user with same email were existed")   
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function generateTokens(tokenPayload){
    try {
        const userId  = tokenPayload
        console.log("userId",userId)
            const accessToken = await jwt.sign(
            {userId},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : "1h"}
        )
            const refreshToken = await jwt.sign(
            {userId},
            process.env.REFRESH_TOKEN_SECRET
        )
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
    return {accessToken: accessToken,refreshToken: refreshToken}
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function logout(logoutPayload){
    try {
        const { user } = logoutPayload
        const refreshTokens = await refreshTokenModel.deleteOne({userId : user._id})
        if(!refreshTokens){
            throw err
        }
        return (refreshTokens)
    } catch (err) {
        console.log(err)
        throw err
    }
}

module.exports = {
    newUser,readUser,logout,generateTokens
}