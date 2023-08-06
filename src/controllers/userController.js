const httpErrors = require('http-errors')
const userServices = require('../services/userServices')
const { authConfig } = require('../config/authConfig')

async function createUser(req, res, next) {
    try {
        const signupPayload = {
            userName: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
        const signupData = await userServices.newUser(signupPayload)
        return res.send(signupData)
    } catch (err) {
        console.log(err)
        const signupError = httpErrors(401, 'Unauthorized : User Registration failed!');
        next(signupError)
    }
}
async function userLogin(req, res, next) {
    try {
        const { username, password } = req.body
        const loggedUserId = await userServices.userLogin(username, password)
        const { refreshToken, accessToken } = await userServices.generateTokens(loggedUserId)
        await userServices.saveTokens(loggedUserId, refreshToken)
        res.cookie('rtoken', refreshToken, { httpOnly: true, maxAge: authConfig.cookieExpiry.maxAge });
        return res.send({ accessToken, refreshToken })
    } catch (err) {
        console.log(err)
        next(httpErrors(401, 'Unauthorized : Login failed!'))
    }
}

async function userLogout(req, res, next) {
    try {
        const logout = await userServices.userLogout(req.user)
        res.clearCookie('jwt')
        return res.send(logout)
    } catch (err) {
        console.log(err)
        const logoutError = httpErrors(401, 'Unauthorized : logout failed!');
        next(logoutError)
    }
}


module.exports = {
    createUser,
    userLogout,
    userLogin
}