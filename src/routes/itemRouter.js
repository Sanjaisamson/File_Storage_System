const express = require('express')
const itemRouter = express.Router()
const itemController = require('../controllers/items.controller')
const uploadHandler = require('../middlewares/uploadHandler.middleware')
const authHandler = require('../middlewares/authHandler.middleware')

itemRouter.post('/view-file',authHandler.isAuthenticated,itemController.newFolder)
itemRouter.post('/new-folder',authHandler.isAuthenticated,itemController.newFolder)
itemRouter.post('/upload-file',authHandler.isAuthenticated,uploadHandler,itemController.uploadFile)
itemRouter.post('/share-item',authHandler.isAuthenticated,itemController.shareFile)
itemRouter.post('/edit-item',authHandler.isAuthenticated,itemController.editFile)
itemRouter.post('/delete-file',authHandler.isAuthenticated,itemController.deleteFile)
itemRouter.get('/view-folder',authHandler.isAuthenticated,itemController.viewFolder)
itemRouter.get('/download-file',authHandler.isAuthenticated,itemController.downloadFile)
itemRouter.get('/delete-folder',authHandler.isAuthenticated,itemController.deleteFolder)

module.exports = itemRouter;