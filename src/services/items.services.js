const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const permissionService = require('./permission.services')
const { defaultDir } = require('../config/defaultStoragePath');
const { PermissionModel } = require('../models/permission.model')
const { nanoid } = require('nanoid')
const { ItemModel } = require('../models/items.model');
const { UserModel } = require('../models/user.model')
const { PERMISSIONS } = require('../const/permission.const')
const { ITEMTYPES } = require('../const/itemtypes.const');

async function getUserRootFolder(user) {
    try {
        const rootFolder = await ItemModel.findOne({ ownerMailId: user.email, parentFolder: null })
        if (!rootFolder) {
            throw new Error("internal server error : This user has no root folder")
        }
        return (rootFolder)
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function createRootFolder(userId) {
    try {
        const storagePath = path.join(defaultDir, userId);
        const findUser = await UserModel.findOne({ _id: userId })
        const isFileExist = fs.existsSync(storagePath)
        if (isFileExist) {
            throw new Error("Sorry!!! Root Folder already exists");
        } else {
            const newItem = new ItemModel({
                ownerId: userId,
                name: userId,
                size: 0,
                ownerMailId: findUser.email,
                parentFolder: null,
                type: ITEMTYPES.FOLDER,
                extension: null,
                storagePath,
            })
            await newItem.save()
            await fsPromises.mkdir(storagePath)
            return newItem
        }
    } catch (err) {
        throw err
    }
}

async function createNewFolder(payload) {
    try {
        const { user, folderName, parentFolderId } = payload
        const storagePath = path.join(defaultDir, user._id, folderName)
        const newItem = new ItemModel({
            ownerId: user._id,
            name: folderName,
            size: 0,
            ownerMailId: user.email,
            parentFolder: parentFolderId,
            type: ITEMTYPES.FOLDER,
            extension: null,
            storagePath: storagePath,
        })
        await newItem.save()
        return newItem
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function uploadFile(payload) {
    try {
        const { user, file, fileNameOverride, parentFolderId } = payload
        //nanoid is created and assigned it as itemNanoName
        const itemNanoName = nanoid()
        //create file path
        const filePath = path.join(defaultDir, user._id, itemNanoName)
        const writeFile = fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
                console.log(err)
                throw new Error('file cant be able to save')
            }
            console.log("file saved successfully")
        })
        let fileName = fileNameOverride ? fileNameOverride : file.originalname;
        const extension = fileName.split('.').pop()
        const newItem = new ItemModel({
            ownerId: user._id,
            name: fileName,
            size: file.size,
            ownerMailId: user.email,
            parentFolder: parentFolderId,
            type: ITEMTYPES.FILE,
            extension: extension,
            storagePath: filePath,
        })
        newItem.save()
        return writeFile, newItem
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function viewFolder(payload) {
    try {
        const { user, itemId } = payload
        const item = await ItemModel.findOne({ _id: itemId })
        if (!item) {
            throw new Error("Item doesnot exist !!!")
        }
        if (item.type !== ITEMTYPES.FOLDER) {
            throw new Error("Item type invaid !!!")
        }
        const permissionPayload = {
            user,
            item,
            action: PERMISSIONS.READ
        }
        const isPermitted = await permissionService.isAllowed(permissionPayload)
        if (!isPermitted) {
            throw new Error('Permisiion denied!!!')
        } else {
            const folderData = {
                type: item.type,
                id: item._id,
                ownerId: item.ownerId,
                name: item.name,
                size: item.size, // TODO: Calculate size in disk
                ownerMailId: item.ownerMailId,
                parentFolder: item.parentFolder,
            };
            const folderContent = await ItemModel.find({ parentFolder: item._id })
            const responseObject = {
                ...folderData,
                content: folderContent
            }
            return (responseObject)
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function shareFile(payload) {
    try {
        const { userMailId, itemId, permissionValue, owner } = payload
        const isOwner = await ItemModel.findOne({ _id: itemId, ownerMailId: owner.email })
        if (isOwner) {
            const isExist = await PermissionModel.findOne({ userMailId: userMailId, itemId: itemId })
            if (isExist) {
                throw new Error('Sorry this User-Item combination already exist');
            }
            const newValue = new PermissionModel({
                userMailId,
                itemId,
                permission: {
                    value: permissionValue
                }
            })
            newValue.save()
            return newValue
        }
        throw new Error("Sorry you are not the owner of this file!")
    } catch (err) {
        throw err
    }
}

async function editFile(reqPayload) {
    try {
        const { itemId, user, newName } = reqPayload
        const item = await ItemModel.findOne({ _id: itemId })
        if (!item) {
            throw new Error("Item doesn't exist!!!")
        }
        const permissionPayload = {
            user,
            item,
            action: PERMISSIONS.WRITE
        }
        const isPermitted = await permissionService.isAllowed(permissionPayload)
        if (isPermitted) {
            if (item.type == ITEMTYPES.FOLDER) {
                const updateStatus = await ItemModel.updateOne({ _id: item._id }, { $set: { name: newName } })
                return (updateStatus)
            }
            const newFileName = `${newName}.${item.extension}`
            const updateStatus = await ItemModel.updateOne({ _id: item._id }, { $set: { name: newFileName } })
            return (updateStatus)
        } else {
            throw new Error('Sorry!!! Cant update the file')
        }
    }
    catch (err) {
        throw err
    }
}
async function downloadFile(payload) {
    try {
        const { user, itemId } = payload
        const item = await ItemModel.findOne({ _id: itemId })
        if (!item) {
            throw new Error("item doesnot exist")
        }
        if (item.type !== ITEMTYPES.FILE) {
            throw new Error("item type invaid")
        }
        const permissionPayload = {
            user,
            item,
            action: PERMISSIONS.READ
        }
        const isPermitted = await permissionService.isAllowed(permissionPayload)
        if (isPermitted) {
            const contents = await fsPromises.readFile(item.storagePath, { encoded: 'utf8' });
            if (!contents) {
                throw new Error("Cant Read File!!!")
            }
            return (contents)
        } else {
            return new Error('You have no permission to download this file')
        }
    } catch (err) {
        throw err
    }
}

async function deleteFile(reqPayload) {
    try {
        const { user, fileId } = reqPayload
        const item = await ItemModel.findOne({ _id: fileId })
        if (!item) {
            throw new Error("item doesnot exist")
        }
        if (item.type !== ITEMTYPES.FILE) {
            throw new Error("item type invaid")
        }
        const permissionPayload = {
            user,
            item,
            action: PERMISSIONS.DELETE
        }
        const isPermitted = await permissionService.isAllowed(permissionPayload)
        if (isPermitted) {
            const deletedFile = await fsPromises.unlink(filePath)
            console.log('Deleted successfully')
            const deleteDbDocument = await ItemModel.deleteOne({ _id: fileId })
            console.log("Deleted from db also")
            return deletedFile, deleteDbDocument
        }
        throw new Error('Sorry !!! you have no permission to delete this file')
    } catch (err) {
        throw err
    }
}
async function deleteItems(fileArray, folderArray) {
    try {
        const files = [...fileArray]
        const folders = [...folderArray]
        for (let element of files) {
            const dbContent = await ItemModel.findOne({ _id: element })
            const deleteFileContent = await fsPromises.unlink(dbContent.storagePath)
            const deleteDbContent = await ItemModel.deleteOne({ _id: element })
        }
        for (let element of folders) {
            const clearFolder = await ItemModel.deleteOne({ _id: element })
        }
        console.log("Folder deleted successfully")
    } catch (err) {
        throw err
    }
}

async function scanFolders(itemId, user) {
    try {
        const item = await ItemModel.findOne({ _id: itemId })
        if (!item) {
            throw new Error("item doesnot exist")
        }
        if (item.type !== ITEMTYPES.FOLDER) {
            throw new Error("item type invalid")
        }
        const permissionPayload = {
            user,
            item,
            action: PERMISSIONS.DELETE
        }
        const isPermitted = await permissionService.isAllowed(permissionPayload)
        if (isPermitted) {
            let fileArray = []
            let folderArray = []
            let scannedFolders = []
            if (item.parentFolder){
                scannedFolders.push(itemId);
            }
            const items = await ItemModel.find({ parentFolder: itemId })
            items.forEach(element => {
                if (element.type === ITEMTYPES.FILE) {
                    fileArray.push(element._id)
                } else if (element.type === ITEMTYPES.FOLDER) {
                    folderArray.push(element._id)
                } else {
                    throw new Error('Sorry!!! Cannot list files')
                }
            })
            while (folderArray.length > 0) {
                const childId = folderArray.shift();
                const recursiveCall = await scanFolders(childId);
                fileArray.push(...recursiveCall.fileArray);
                folderArray.push(...recursiveCall.folderArray);
                scannedFolders.push(...recursiveCall.scannedFolders);
            }
            return { fileArray, folderArray, scannedFolders }
        }
        throw new Error("Sorry you have no permission to delete this folder")
    } catch (err) {
        console.log(err)
        throw err
    }
}
module.exports = {
    createRootFolder,
    createNewFolder,
    uploadFile,
    downloadFile,
    shareFile,
    editFile,
    deleteFile,
    viewFolder,
    scanFolders,
    deleteItems,
    getUserRootFolder
}