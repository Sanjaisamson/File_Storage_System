const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')
const authHandler = require('../middlewares/authHandler.middleware')
const loginHandler = require('../middlewares/loginHandler.middleware')

userRouter.post('/refresh',authHandler.refreshTokenVerify)
userRouter.post('/sign-up',userController.createUser)
userRouter.post('/login',loginHandler.isVerified,userController.generateTokens)
userRouter.get('/logout',authHandler.isAuthenticated, userController.logoutUser)

module.exports = userRouter
