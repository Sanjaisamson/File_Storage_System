const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')
const authhandler = require('../middlewares/authHandler.middleware')
const loginHandler = require('../middlewares/loginHandler.middleware')

userRouter.get('/',authhandler.isAuthenticated, userController.getUser)
userRouter.get('/refresh',authhandler.refreshTokenVerify)
userRouter.post('/sign-up',userController.createUser)
userRouter.post('/login',loginHandler.isVerified,userController.getUser)
//userRouter.delete('/logout',userController.logoutUser)

module.exports = userRouter
