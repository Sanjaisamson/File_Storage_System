const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const { nanoid } = require('nanoid')
const itemModel = require('../models/items.model');
const userModel = require('../models/user.model')
const defaultStoragePath = require('../config/defaultStoragePath');
const permissionModel = require('../models/permission.model')
const permissionService = require('./permission.services')
const { PERMISSIONS } = require('../const/permission.const')
const { ITEMTYPES } = require('../const/itemtypes.const');
const defaultDir = defaultStoragePath

async function createRootFolder(reqPayload) {
    try {
        const userId = reqPayload
        console.log(userId)
        const _id = userId
        const folderPath = path.join(defaultDir, userId);
        const fileExixst = fs.existsSync(folderPath)
        if (fileExixst) {
            throw new Error("sorry folder already exist");
        } else {
            const findUser = await userModel.findOne({ _id })
            if (!findUser) {
                throw new Error("sorry user doesnot exist")
            }
            const owner = findUser.email
            const storagePath = folderPath
            const newItem = new itemModel({
                userId: userId,
                name: userId,
                size: 0,
                owner: owner,
                parentFolder: null,
                type: ITEMTYPES.FOLDER,
                extension: null,
                StoragePath: storagePath,
            })
            newItem.save()
            fs.mkdir(folderPath, (err) => {
                if (err) {
                    throw err
                }
                console.log("Root folder created successfully")
            })
            return { newItem }
        }
    } catch (err) {
        throw err
    }
}

async function newFolder(reqPayload) {
    try {
        const { user, folderName, parentFolder } = reqPayload
        const owner = await userModel.findOne({ _id: user._id })
        console.log(user)
        if (!owner) {
            throw new Error("sorry user doesnot exist")
        }
        const parentFolderName = parentFolder
        const storagePath = path.join(defaultDir, user._id, folderName)
        const newItem = new itemModel({
            userId: user._id,
            name: folderName,
            size: 0,
            owner: user.email,
            parentFolder: parentFolderName,
            type: ITEMTYPES.FOLDER,
            extension: null,
            StoragePath: storagePath,
        })
        newItem.save()
        return { newItem }
    } catch (err) {
        throw err
    }
}

async function viewContent(reqPayload) {
    try {
        const { user, itemId } = reqPayload
        const item = await itemModel.findOne({ _id: itemId })
        if (!item) {
            throw new Error("item doesnot exist")
        }
        if (item.type !== ITEMTYPES.FOLDER) {
            throw new Error("item type invaid")
        }
        const permissionPayload = {
            user,
            item,
            action: PERMISSIONS.READ
        }
        const isPermitted = await permissionService.isAllowed(permissionPayload)
        const folderData = {
            type: item.type,
            id: item._id,
            userId: item.userId,
            name: item.name,
            size: item.size,
            owner: item.owner,
            parentFolder: item.parentFolder,
            extension: item.extension,
        }
        if (!isPermitted) {
            throw new Error('permisiion denied')
        } else {
            const folderContent = await itemModel.find({ parentFolder: item._id })
            const responseObject = {
                ...folderData,
                content: folderContent
            }
            return (responseObject)
        }
    } catch (err) {
        throw err
    }
}

async function uploadDoc(reqPayload) {
    try {
        const { user, file, fileNameOverride, parentFolder } = reqPayload
        console.log(fileNameOverride)
        const userId = user._id
        //nanoid is created and assigned it as itemName
        const fileNameId = nanoid()
        const itemName = fileNameId;
        //create file path
        const filePath = path.join(defaultDir, userId, itemName)
        const writeFile = fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
                console.log(err)
                console.log("sorry file cant save")
                throw new Error('file cant be able to save')
            }
            console.log("file saved successfully")
            return { message: 'file saved successfully' }
        })

        let fileName = fileNameOverride ? fileNameOverride : file.originalname;
        const parentFolderName = parentFolder ? parentFolder : userId
        //is existing user?
        const findUser = await userModel.findOne({ _id: userId })
        if (!findUser) {
            throw new Error("sorry user doesnot exist")
        }
        const extension = fileName.split('.').pop()
        const owner = user.email
        const newItem = new itemModel({
            userId: userId,
            name: fileName,
            size: file.size,
            owner: owner,
            parentFolder: parentFolderName,
            type: ITEMTYPES.FILE,
            extension: extension,
            StoragePath: filePath,
        })
        newItem.save()
        return { newItem }
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function shareDoc(reqPayload) {
    try {
        const { userMailId, itemId, permissionValue, owner } = reqPayload
        const isOwner = await itemModel.findOne({ _id: itemId, owner: owner.email })
        if (isOwner) {
            const isExist = await permissionModel.findOne({ userMailId: userMailId, itemId: itemId })
            if (isExist) {
                throw new Error('sorry this User-Item combination already exist');
            }
            const newValue = new permissionModel({
                userMailId: userMailId,
                itemId: itemId,
                permissionValue: {
                    p: permissionValue
                }
            })
            newValue.save()
            return { newValue }
        }
        throw new Error("Sorry you are not the owner of this file!")
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function editDoc(reqPayload) {
    try {
        const { itemId, user, newName } = reqPayload
        const item = await itemModel.findOne({ _id: itemId })
        if (!item) {
            throw new Error("item doesnot exist")
        }
        const permissionPayload = {
            user,
            item,
            action: PERMISSIONS.WRITE
        }
        const isPermitted = await permissionService.isAllowed(permissionPayload)
        if (isPermitted) {
            const filePath = item.StoragePath
            const fileExixst = fs.existsSync(filePath)
            if (fileExixst) {
                const newFileName = newName +"."+item.extension
                const fileRename = await itemModel.updateOne({_id:item._id},{$set:{name:newFileName}})
                console.log(fileRename)
                return (fileRename)
            } else {
                return new Error('sorry error on editing file!')
            }
        } else {
            throw new Error('sorry permission denied!')
        }
    } catch (err) {
        console.log(err)
        return { err }
    }
}
async function downloadDoc(reqPayload) {
    try {
        const { user, itemId } = reqPayload
        const item = await itemModel.findOne({ _id: itemId })
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
            const requiredItem = await itemModel.findOne({ _id: itemId })
            console.log(requiredItem)
            const filePath = requiredItem.StoragePath
            const fileExixst = fs.existsSync(filePath)
            if (fileExixst) {
                const contents = await fsPromises.readFile(filePath, { encoded: 'utf8' });
                console.log(contents)
                return (contents )
            } else {
                return new Error('sorry error on reading file!')
            }
        } else {
            throw new Error('sorry permission denied!')
        }

    } catch (err) {
        console.log(err)
        return { err }
    }
}

async function deleteDoc(reqPayload) {
    try {
        const { user, itemId } = reqPayload
        const item = await itemModel.findOne({ _id: itemId })
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
            const filePath = item.StoragePath
            const isFileExisting = fs.existsSync(filePath)
            console.log(isFileExisting)
            if (isFileExisting) {
                const contents = fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err)
                        throw err
                    }
                    console.log('deleted successfully')
                    return (contents)
                });
            }
            const deleteDbDocument = await itemModel.deleteOne({ _id: itemId })
            console.log("deleted from db also")
        }
         throw new Error('you dont have the permission to delete this file')
    } catch (err) {
        console.log(err)
        return { err }
    }
}
module.exports = {
    createRootFolder, newFolder, uploadDoc, downloadDoc, shareDoc, editDoc, deleteDoc, viewContent
}