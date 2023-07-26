const express = require('express')
const itemRouter = express.Router()
const itemController = require('../controllers/items.controller')
const uploadHandler = require('../middlewares/uploadHandler.middleware')
const authHandler = require('../middlewares/authHandler.middleware')


itemRouter.post('/new-folder',authHandler.isAuthenticated,itemController.newFolder)
itemRouter.post('/upload-item',authHandler.isAuthenticated,uploadHandler,itemController.uploadDoc)
itemRouter.post('/share-item',authHandler.isAuthenticated,itemController.shareDoc)
itemRouter.post('/edit-item',authHandler.isAuthenticated,itemController.editDoc)
itemRouter.post('/delete-item',authHandler.isAuthenticated,itemController.deleteDoc)
itemRouter.get('/view-content',authHandler.isAuthenticated,itemController.viewContent)
itemRouter.get('/download-item',authHandler.isAuthenticated,itemController.downloadDoc)

module.exports = itemRouter;