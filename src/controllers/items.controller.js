const itemsModel = require('../models/items.model')
const itemServices = require('../services/items.services')
const httpErrors = require('http-errors')

const uploadDoc = async (req,res,next) => {
    try {
        const reqPayload = {
            user : req.user,
            file : req.file,
            fileNameOverride : req.body.fileName,
            parentFolder : req.body.parentFolder
        }
        console.log(reqPayload)
        const newFile = await itemServices.uploadDoc(reqPayload)
        res.send(newFile)
        next()
    } catch (err) {
        console.log(err)
        const uploadError = httpErrors(422,'Unprocessable Entity : uploading unsuccessful') 
        next(uploadError)
    }
}
const newFolder = async (req,res,next) => {
    try {
        const reqPayload = {
            user : req.user,
            folderName : req.body.folderName,
            parentFolder : req.body.parentFolderId
        }
        const newFolder = await itemServices.newFolder(reqPayload)
        res.send(newFolder)
        next()
    } catch (err) {
        console.log(err)
        const newFolderError = httpErrors(400,'Bad Request : Failed To Create New Folder')
        next(newFolderError)
    }
}

const viewContent = async(req,res,next) => {
    try {
        const reqPayload = {
            user : req.user,
            itemId : req.query.itemId
        }
        const content = await itemServices.viewContent(reqPayload)
        res.send(content)
        next()
    } catch (err) {
        console.log(err)
        const viewContentError = httpErrors(400,'Bad Request : Failed To view Content')
        next(viewContentError)
    }
}

const shareDoc = async (req, res, next) => {
    try {
        const reqPayload = {
            userMailId : req.body.userMailId,
            itemId : req.body.itemId,
            permissionValue : req.body.permissionValue.p,
            owner : req.user
        }
        const shareDocument = await itemServices.shareDoc(reqPayload);
        res.send('new permission value added successfully')
        next()
    } catch (err) {
        console.log(err)
        const shareDocError = httpErrors(400,'Bad Request : Failed To share file or to Add permission')
        next(shareDocError)
    }
}

const editDoc = async (req, res, next) => {
    try {
        const reqPayload = {
            itemId : req.body.itemId,
            user : req.user,
            newName : req.body.changingData.newName
        }
        const editedDocument = await itemServices.editDoc(reqPayload)
        res.send(editedDocument)
        next()
    } catch (err) {
        console.log(err)
        const editDocError = httpErrors(400,'Bad Request : Failed To edit Document')
        next(editDocError)
    }
}

const downloadDoc = async (req,res,next) => {
    try {
        const reqPayload = {
            user : req.user ,
            itemId : req.query.itemId,
        }
        const viewDocument = await itemServices.downloadDoc(reqPayload)
        res.send(viewDocument)
        next()
    } catch (err) {
        console.log(err)
        const viewDocError = httpErrors(400,'Bad Request : Failed To Download Document!')
        next(viewDocError)
    }
}

const deleteDoc = async (req, res, next) => {
    try {
        const reqPayload = {
            user : req.user,
            itemId : req.body.itemId
        }
        const deleteDocument = await itemServices.deleteDoc(reqPayload)
        res.send(deleteDocument)
        next()
    } catch (err) {
        console.log(err)
        const deleteDocError = httpErrors(400,'Bad Request : Failed To Delete Document!')
        next(deleteDocError)
    }
}
const deleteFolder = async (req, res, next) => {
    try {
        const itemId = req.params.id
        const deleteFolder = await itemServices.deleteFolder(itemId) 
        res.send(deleteFolder)
        next()
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    uploadDoc,newFolder,downloadDoc,shareDoc,editDoc,deleteDoc,viewContent,deleteFolder
} 