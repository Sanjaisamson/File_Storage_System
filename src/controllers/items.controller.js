const itemServices = require('../services/items.services')
const httpErrors = require('http-errors')

const newFolder = async (req, res, next) => {
    try {
        const payload = {
            user: req.user,
            folderName: req.body.folderName,
            parentFolderId: req.body.parentFolderId
        }
        if (!req.body.parentFolderId) {
            throw new httpErrors(400, "Bad request!!! Parent folder data missing")
        }
        const newFolder = await itemServices.createNewFolder(payload)
        return res.send(newFolder)
    } catch (err) {
        console.log(err)
        if (err.status) {
            throw err
        }
        const newFolderError = httpErrors(403, 'Forbidden!!! Failed to create new folder')
        next(newFolderError)
    }
}

const uploadFile = async (req, res, next) => {
    try {
        const payload = {
            user: req.user,
            file: req.file,
            fileNameOverride: req.body.fileName,
            parentFolderId: req.body.parentFolderId
        }
        if (!req.file) {
            throw new httpErrors(400, "Bad request!!! File is missing")
        }
        if (!req.body.parentFolderId) {
            throw new httpErrors(400, "Bad request!!! Parent folder missing")
        }
        const newFile = await itemServices.uploadFile(payload)
        return res.send({
            data: newFile
        }) // Send unified response structure { data: <response-data>}
    } catch (err) {
        console.log(err)
        if (err.status) {
            throw err
        }
        const uploadError = httpErrors(422, 'Unprocessable entity : uploading unsuccessful')
        next(uploadError)
    }
}

const viewFolder = async (req, res, next) => {
    try {
        const user = req.user
        let itemId = req.query.itemId
        if (!itemId) {
            const rootFolder = await itemServices.getUserRootFolder(user);
            itemId = rootFolder._id;
        }
        const content = await itemServices.viewFolder({
            user,
            itemId
        })
        return res.send(content) // TODO: Response structure
    } catch (err) {
        console.log(err)
        if (err.status) {
            throw err
        }
        const viewContentError = httpErrors(403, 'Forbidden: Failed to view content')
        next(viewContentError)
    }
}

const shareFile = async (req, res, next) => {
    try {
        const { body } = req;
        const payload = {
            userMailId: body.userMailId,
            itemId: body.itemId,
            permissionValue: body.permission.value,
            owner: req.user
        }
        if (!body.userMailId) {// TODO: Add yup for validation
            throw httpErrors(400, "Bad request !!! Usermailid is missing ")
        }
        if (!body.itemId) {
            throw httpErrors(400, "Bad request !!! Itemid is missing ")
        }
        if (!body.permission.value) {
            throw httpErrors(400, "Bad request !!! Permission value is missing ")
        }
        const sharedFile = await itemServices.shareFile(payload);
        return res.send(sharedFile)
    } catch (err) {
        console.log(err)
        if (err.status) {
            throw err
        }
        const shareFileError = httpErrors(403, 'Forbidden : Failed to share file or to add permission')
        next(shareFileError)
    }
}

const editFile = async (req, res, next) => {
    try {
        const payload = {
            itemId: req.body.itemId,
            user: req.user,
            newName: req.body.changingData.newName
        }
        if (!req.body.changingData) {
            throw httpErrors(400, "Bad Request !!! No data to update... ")
        }
        const editStatus = await itemServices.editFile(payload) // TODO: Standardise response
        return res.send(editStatus)
    } catch (err) {
        console.log(err)
        if (err.status) {
            throw err
        }
        const editFileError = httpErrors(403, 'Forbidden : Failed to edit document!!!')
        next(editFileError)
    }
}

const downloadFile = async (req, res, next) => {
    try {
        const payload = {
            user: req.user,
            itemId: req.query.itemId,
        }
        if (!req.query.itemId) {
            throw httpErrors(400, " Bad Request !!! Itemid is missing.... ") // TODO: Strings should be grammaticaly and case wise correct
        }
        const downloadedFile = await itemServices.downloadFile(payload)
        return res.send(downloadedFile)
    } catch (err) {
        console.log(err)
        if (err.status) {
            throw err
        }
        const downloadFileError = httpErrors(403, 'Forbidden: Failed to download file!!!')
        next(downloadFileError)
    }
}

const deleteFile = async (req, res, next) => {
    try {
        const payload = {
            user: req.user,
            fileId: req.query.fileId
        }
        if (!req.query.fileId) {
            throw httpErrors(400, " bad Request !!! File id is missing")
        }
        const deleteFileStatus = await itemServices.deleteFile(payload)
        return res.send(deleteFileStatus)
    } catch (err) {
        console.log(err)
        if (err.status) {
            throw err
        }
        const deleteFileError = httpErrors(403, 'Forbidden: Failed to delete document!!!')
        next(deleteFileError)
    }
}
const deleteFolder = async (req, res, next) => {
    try {
        const itemId = req.query.folderId
        const user = req.user
        const scannedItems = await itemServices.scanFolders(itemId, user)
        const deleteFolderStatus = await itemServices.deleteItems(scannedItems.fileArray, scannedItems.scannedFolders)
        return res.send(deleteFolderStatus)
    } catch (err) {
        console.log(err)
        const deleteFolderError = httpErrors(403, 'Forbidden : Failed to delete folder!...')
        next(deleteFolderError)
    }
}

module.exports = {
    uploadFile,
    newFolder,
    downloadFile,
    shareFile,
    editFile,
    deleteFile,
    viewFolder,
    deleteFolder
} 