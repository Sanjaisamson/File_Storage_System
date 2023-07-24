
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const multer = require('multer');
const itemServices = require('../services/items.serveices')
const httpErrors = require('http-errors')

const uploadDoc = async (req,res,next) => {
    try {
        console.log(req.file)
        const reqPayload = {
            userId : req.params.id,
            file : req.file
        }
        console.log(typeof reqPayload.file)

        const newFile = await itemServices.uploadDoc(reqPayload)
        res.send(newFile)
        next()
    } catch (err) {
        console.log(err)
        const uploadError = httpErrors(409,'uploading unsuccessful') 
        next(uploadError)
    }
}

const viewDoc = async (req,res,next) => {
    try {
        const reqPayload = {
            userId : req.body.userId,
            itemId : req.body.itemId
        }
        const viewDocument = await itemServices.viewDoc(reqPayload)
        res.send(viewDocument)
        next()
    } catch (err) {
        console.log(err)
        const viewDocError = httpErrors(402,'Failed To Create New Folder')
        next(viewDocError)
    }
}

const shareDoc = async (req, res, next) => {
    try {
        const reqPayload = {
            ownerId : req.body.ownerId,
            userMailId : req.body.userMailId,
            itemId : req.body.itemId,
            permissionValue : req.body.permissionValue.p
        }
        const shareDocument = await itemServices.shareDoc(reqPayload);
        res.send('new permission value added successfully')
        next()
    } catch (err) {
        console.log(err)
        const shareDocError = httpErrors(402,'Failed To Add permission')
        next(shareDocError)
    }
}
const newFolder = async (req,res,next) => {
    try {
        const reqPayload = {
            userId : req.body.userId,
            foldername : req.body.foldername
        }
        const newFolder = await itemServices.newFolder(reqPayload)
        res.send(newFolder)
        next()
    } catch (err) {
        console.log(err)
        const newFolderError = httpErrors(402,'Failed To Create New Folder')
        next(newFolderError)
    }
}
module.exports = {
    uploadDoc,newFolder,viewDoc,shareDoc
} 