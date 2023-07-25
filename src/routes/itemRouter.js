const express = require('express')
const itemRouter = express.Router()
const itemController = require('../controllers/items.controller')
const uploadHandler = require('../middlewares/uploadHandler.middleware')
const permissionServices = require('../services/permission.services')
const authHandler = require('../middlewares/authHandler.middleware')

itemRouter.post('/view-item',authHandler.isAuthenticated,itemController.viewDoc)
itemRouter.post('/view-content',authHandler.isAuthenticated,itemController.viewContent)
itemRouter.post('/upload-item',authHandler.isAuthenticated,uploadHandler,itemController.uploadDoc)
itemRouter.post('/share-item',authHandler.isAuthenticated,itemController.shareDoc)
itemRouter.post('/edit-item',authHandler.isAuthenticated,itemController.editDoc)
itemRouter.post('/new-folder',itemController.newFolder)
itemRouter.post('/delete-item',authHandler.isAuthenticated,itemController.deleteDoc)

module.exports = itemRouter;