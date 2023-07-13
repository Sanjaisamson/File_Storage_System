
const jwt = require('jsonwebtoken')
require('dotenv').config()
const httpErrors = require('http-errors')
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt');

async function readUser(payload){
    const {_id } = payload
    console.log(_id)
    const userData = await userModel.findOne({_id})
    return(userData)
}

async function newUser(signupData){
    try {
        const {username, address, phone_no, password } = signupData
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const userData = await userModel.create({
            name : username,
            address : address,
            phoneno : phone_no,
            password : hashedPassword
        })
        console.log(hashedPassword)
        return {userData}
    } catch (err) {
        console.log(err)
        throw err
    }
}
async function generateTokens(tokenPayload){

    try {
        const userId  = tokenPayload
            const accessToken = await jwt.sign(
            {userId},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : "1m"}
        )
            const refreshToken = await jwt.sign(
            {userId},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn : "2m"}
        )
    return {accessToken: accessToken,refreshToken: refreshToken}
    } catch (err) {
        console.log(err)
        throw err
    }
}


async function update(updatedData){
    try {
        const {id , requestPayload } = updatedData
        const userId = await userModel.findById(id)
        const updatedUser = await userModel.findByIdAndUpdate(id, requestPayload, {new : true});
        return {updatedUser}
    } catch (err) {
        console.log(err)
        throw err
    }
}

module.exports = {
    newUser,readUser,update,generateTokens
}