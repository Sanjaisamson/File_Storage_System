const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcrypt');
const { UserModel } = require('../models/user.model')
const { RefreshTokenModel }= require('../models/refreshToken.Model')
const itemServices = require('../services/items.services')


async function newUser(signupData){
    try {
        const {username, email,  password } = signupData
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const findUser = await UserModel.findOne({email : email})
        if(!findUser){
            const user = await UserModel.create({
                name : username,
                email : email,
                password : hashedPassword
            })
            const rootFolder = await itemServices.createRootFolder(user._id)
            return {user,rootFolder}
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
            const accessToken = jwt.sign(
            {userId},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : "10m"}
        )
            const refreshToken = jwt.sign(
            {userId},
            process.env.REFRESH_TOKEN_SECRET
        )
        const findUser = await RefreshTokenModel.findOne({userId})
        if(!findUser){
            const saveToken = await new RefreshTokenModel({
                userId : userId,
                refreshToken : refreshToken,
            })
            console.log("the user not existed so created")
            await saveToken.save();
        }else{
            const saveNewToken = await RefreshTokenModel.findOneAndUpdate(
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

async function logoutUser(logoutPayload){
    try {
        const { user } = logoutPayload
        const refreshTokens = await RefreshTokenModel.deleteOne({userId : user._id})
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
    newUser,logoutUser,generateTokens
}