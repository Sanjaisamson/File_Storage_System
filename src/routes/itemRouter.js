const express = require('express')
const itemRouter = express.Router()
const itemController = require('../controllers/items.controller')
const uploadHandler = require('../middlewares/uploadHandler.middleware')
const permissionServices = require('../services/permission.services')


itemRouter.get('/api/views',itemController.viewDoc),
itemRouter.post('/upload/:id',uploadHandler,itemController.uploadDoc),
itemRouter.post('/share-item',itemController.shareDoc)
itemRouter.post('/access-item',permissionServices.isPermissionClear)
itemRouter.post('/new-folder',itemController.newFolder)


module.exports = itemRouter;