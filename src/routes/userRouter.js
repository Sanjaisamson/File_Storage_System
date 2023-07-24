const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')
const authhandler = require('../middlewares/authHandler.middleware')
const loginHandler = require('../middlewares/loginHandler.middleware')


userRouter.get('/',authhandler.isAuthenticated, userController.getUser)
userRouter.get('/refresh/:id',authhandler.refreshTokenVerify)
userRouter.post('/sign-up',userController.createUser)
userRouter.post('/login/:id',loginHandler.isVerified,userController.generateTokens)
userRouter.put('/update/:id',userController.updateUser)

module.exports = userRouter
