const itemServices = require('../services/items.services')
const httpErrors = require('http-errors')


const newFolder = async (req,res,next) => {
    try {
        const reqPayload = {
            user : req.user,
            folderName : req.body.folderName,
            parentFolder : req.body.parentFolderId
        }
        if(!req.body.parentFolderId){
            throw new httpErrors(400,"Bad Request!!! Parent Folder Data missing")
        }
        const newFolder = await itemServices.createNewFolder(reqPayload)
        return res.send(newFolder)
    } catch (err) {
        console.log(err)
        if(err.status){
            throw err
        }
        const newFolderError = httpErrors(403,'Forbidden!!! Failed To Create New Folder')
        next(newFolderError)
    }
}

const uploadFile = async (req,res,next) => {
    try {
        const reqPayload = {
            user : req.user,
            file : req.file,
            fileNameOverride : req.body.fileName,
            parentFolder : req.body.parentFolder
        }
        if(!req.file){
            throw new httpErrors(400,"Bad Request!!! File is missing")
        }
        if( !req.body.parentFolder){
            throw new httpErrors(400,"Bad Request!!! Parent Folder missing")
        }
        const newFile = await itemServices.uploadFile(reqPayload)
        return res.send(newFile)
    } catch (err) {
        console.log(err)
        if(err.status){
            throw err
        }
        const uploadError = httpErrors(422,'Unprocessable Entity : uploading unsuccessful') 
        next(uploadError)
    }
}

const viewFolder = async(req,res,next) => {
    try {
        
        const user = req.user
        let  itemId = req.query.itemId
        if (!itemId) {
            itemId = await itemServices.getUserRootFolder(user)
        }
        const content = await itemServices.viewFolder({
            user,
            itemId
        })
        return res.send(content)
    } catch (err) {
        console.log(err)
        if(err.status){
            throw err
        }
        const viewContentError = httpErrors(400,'Bad Request : Failed To view Content')
        next(viewContentError)
    }
}

const shareFile = async (req, res, next) => {
    try {
        const { body } = req;
        const payload = {
            userMailId : body.userMailId,
            itemId : body.itemId,
            permissionValue : body.permission.value,
            owner : req.user
        }
        if(!body.userMailId){
            throw httpErrors(400, "Bad Request !!! UserMailId is missing ")
        }
        if(!body.itemId){
            throw httpErrors(400, "Bad Request !!! ItemId is missing ")
        }
        if(!body.permission.value){
            throw httpErrors(400, "Bad Request !!! Permission Value is missing ")
        }
        const sharedFile = await itemServices.shareFile(payload);
        return res.send(sharedFile)
    } catch (err) {
        console.log(err)
        if(err.status){
            throw err
        }
        const shareFileError = httpErrors(400,'Bad Request : Failed To share file or to Add permission')
        next(shareFileError)
    }
}

const editFile = async (req, res, next) => {
    try {
        const payload = {
            itemId : req.body.itemId,
            user : req.user,
            newName : req.body.changingData.newName
        }
        if(!req.body.changingData){
            throw httpErrors(400, "Bad Request !!! Necessary data were missing ")
        }
        const editStatus = await itemServices.editFile(payload)
        return res.send(editStatus)
    } catch (err) {
        console.log(err)
        if(err.status){
            throw err
        }
        const editFileError = httpErrors(400,'Bad Request : Failed To edit Document')
        next(editFileError)
    }
}

const downloadFile = async (req,res,next) => {
    try {
        const payload = {
            user : req.user ,
            itemId : req.query.itemId,
        }
        if(!req.query.itemId){
            throw httpErrors(400, " bad Request !!! ItemId is missing ")
        }
        const downloadedFile = await itemServices.downloadFile(payload)
        return res.send(downloadedFile)
    } catch (err) {
        console.log(err)
        if(err.status){
            throw err
        }
        const viewDocError = httpErrors(400,'Bad Request : Failed To Download Document!')
        next(viewDocError)
    }
}

const deleteFile = async (req, res, next) => {
    try {
        const payload = {
            user : req.user,
            fileId : req.query.fileId
        }
        if(!req.query.fileId){
            throw httpErrors(404, " bad Request !!! FileId is missing ")
        }
        const deleteFileStatus = await itemServices.deleteFile(payload)
        return res.send(deleteFileStatus)
    } catch (err) {
        console.log(err)
        if(err.status){
            throw err
        }
        const deleteFileError = httpErrors(400,'Bad Request : Failed To Delete Document!')
        next(deleteFileError)
    }
}
const deleteFolder = async (req, res, next) => {
    try {
        
            const itemId = req.query.folderId
            const user = req.user
        const scannedItems = await itemServices.scanFolders(itemId,user)
        const deleteFolderStatus = await itemServices.deleteItems(scannedItems.fileArray,scannedItems.scannedFolders)
        return res.send(deleteFolderStatus)
    } catch (err) {
        console.log(err)
        const deleteFolderError = httpErrors(400,'Bad Request : Failed To Delete Folder!')
        next(deleteFolderError)
    }
}

module.exports = {
    uploadFile, newFolder, downloadFile, shareFile, editFile, deleteFile, viewFolder, deleteFolder
} 