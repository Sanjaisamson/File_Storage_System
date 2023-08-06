const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')
const authHandler = require('../middlewares/authHandler.middleware')

userRouter.post('/refresh', authHandler.verifyRefreshToken)
userRouter.post('/sign-up', userController.createUser)
userRouter.post('/login', userController.userLogin)
userRouter.get('/logout', authHandler.isAuthenticated, userController.userLogout)

module.exports = userRouter
