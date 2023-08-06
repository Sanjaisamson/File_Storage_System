const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcrypt');
const { UserModel } = require('../models/user.model')
const { RefreshTokenModel } = require('../models/refreshToken.Model')
const { authConfig } = require('../config/authConfig')
const itemServices = require('../services/items.services')


async function newUser(signupData) {
    try {
        const { userName, email, password } = signupData
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const findUser = await UserModel.findOne({ email: email })
        if (!findUser) {
            const user = await UserModel.create({
                name: userName,
                email: email,
                password: hashedPassword
            })
            const rootFolder = await itemServices.createRootFolder(user._id)
            return { user, rootFolder }
        }
        throw new Error("sorry user with same email were existed")
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function userLogin(username, password) {
    try {
        const user = await UserModel.findOne({ email: username })
        if (!user) {
            throw new Error("User not found!!..")
        }
        const isVerified = await bcrypt.compare(password, user.password)
        if (!isVerified) {
            throw new Error("Failed to Authenticate")
        }
        return user._id
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function generateTokens(userId) {
    try {
        const accessToken = jwt.sign(
            { userId },
             authConfig.secrets.accessToken,
            { expiresIn: authConfig.tokenExpiry.accessTokenExp }
        )
        const refreshToken = jwt.sign(
            { userId },
             authConfig.secrets.refreshToken,
            { expiresIn: authConfig.tokenExpiry.refreshTokenExp }
        )
        return { accessToken: accessToken, refreshToken: refreshToken }
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function saveTokens(userId, refreshToken){
    try {
        const findUser = await RefreshTokenModel.findOne({ userId })
        if (!findUser) {
            const saveToken = await new RefreshTokenModel({
                userId: userId,
                refreshToken: refreshToken,
            })
            console.log("The user not existed so created...")
            await saveToken.save();
        } else {
            const updateToken = await RefreshTokenModel.findOneAndUpdate(
                { userId: userId },
                { refreshToken: refreshToken },
                { upsert: true, new: true }
            )
            console.log("The user is existed so token is replaced...")
            await updateToken.save();
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function userLogout(user) {
    try {
        const refreshToken = await RefreshTokenModel.deleteOne({ userId: user._id })
        if (!refreshToken) {
            throw err
        }
        return (refreshToken)
    } catch (err) {
        console.log(err)
        throw err
    }
}

module.exports = {
    newUser,
    userLogout, 
    generateTokens, 
    userLogin,
    saveTokens
}