const jwt = require('jsonwebtoken')
require('dotenv').config()
const httpErrors = require('http-errors')
const { RefreshTokenModel } = require('../models/refreshToken.Model')
const { UserModel } = require('../models/user.model')
const { authConfig } = require('../config/authConfig')
const userServices = require('../services/userServices')

async function isAuthenticated(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const bearerLessToken = authHeader.split(' ')[1]
        const authVerify = jwt.verify(bearerLessToken, authConfig.secrets.accessToken)
        const authenticatedUser = await UserModel.findOne({ _id: authVerify.userId })
        if (!authenticatedUser) {
            throw new Error("Invalid User")
        }
        req.user = authenticatedUser
        next()
    } catch (err) {
        console.log(err)
        next(httpErrors(401, "Unauthorized!!! authentication failed!"))
    }
}
async function verifyRefreshToken(req, res, next) {
    try {
        const refreshToken = req.cookies.rtoken
        const decodedToken = jwt.verify(refreshToken, authConfig.secrets.refreshToken)
        const isUserExist = await RefreshTokenModel.findOne({
            userId: decodedToken.userId,
            refreshToken: refreshToken
        })
        if (!isUserExist) {
            throw new Error("Unauthorized!!! User not found!!!")
        }
        const generateToken = await userServices.generateTokens(decodedToken.userId)
        return res.json({
            accessToken: generateToken.accessToken
        });
    } catch (err) {
        console.log(err);
        next(httpErrors(401, "Token verification failed!!!"));
    }
}

module.exports = {
    isAuthenticated,
    verifyRefreshToken
}