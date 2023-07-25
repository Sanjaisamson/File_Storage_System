
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const multer = require('multer');
const itemServices = require('../services/items.serveices')
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
        const uploadError = httpErrors(409,'uploading unsuccessful') 
        next(uploadError)
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

const viewContent = async(req,res,next) => {
    try {
        const reqPayload = {
            user : req.user,
            itemId : req.body.itemId
        }
        const content = await itemServices.viewContent(reqPayload)
        next()
    } catch (err) {
        console.log(err)
        const viewContentError = httpErrors(402,'Failed To view Content')
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
        const shareDocError = httpErrors(402,'Failed To Add permission')
        next(shareDocError)
    }
}

const editDoc = async (req, res, next) => {
    try {
        const reqPayload = {
            userMailId : req.body.userMailId,
            itemId : req.body.itemId,
            owner : req.user
        }
        const editedDocument = await itemServices.editDoc(reqPayload)
        res.send(editedDocument)
        next()
    } catch (err) {
        console.log(err)
        const editDocError = httpErrors(402,'Failed To Create New Folder')
        next(editDocError)
    }
}

const viewDoc = async (req,res,next) => {
    try {
        const reqPayload = {
            userMailId : req.body.userMailId,
            itemId : req.body.itemId,
            owner : req.user
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

const deleteDoc = async (req, res, next) => {
    try {
        const reqPayload = {
            userMailId : req.body.userMailId,
            itemId : req.body.itemId
        }
        const deleteDocument = await itemServices.deleteDoc(reqPayload)
        res.send(deleteDocument)
        next()
    } catch (err) {
        console.log(err)
        const deleteDocError = httpErrors(402,'Failed To Create New Folder')
        next(deleteDocError)
    }
}

module.exports = {
    uploadDoc,newFolder,viewDoc,shareDoc,editDoc,deleteDoc,viewContent
} 