const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const itemModel = require('../models/items.model');
const userModel = require('../models/user.model')
const defaultStoragePath = require('../config/defaultStoragePath');
const permissionModel = require('../models/permission.model')
const defaultDir = defaultStoragePath

async function createRootFolder(reqPayload){
    try {
        const userId = reqPayload
        console.log(userId)
        const _id = userId
        const folderPath =  path.join(defaultDir,userId);
    const fileExixst = fs.existsSync(folderPath)
    if(fileExixst){
        throw new Error("sorry folder already exist");
    }else{
        const find_user = await userModel.findOne({_id})
        if(!find_user){
            throw new Error("sorry user doesnot exist")
        }
        const owner = find_user.email
        const storagePath = folderPath
        const newItem = new itemModel({
            userId: userId,
            name: userId,
            size: 0,
            owner: owner,
            parentFolder: null,
            type: 'FOLDER',
            extension: null,
            StoragePath: storagePath,
          })
        newItem.save()
        fs.mkdir(folderPath, (err) => {
            if(err){
                throw err
            }
            console.log("Root folder created successfully")
        })
        return{ newItem }
    }
    } catch (err) {
        throw err
    }
}

async function newFolder(reqPayload){
    try {
        const { userId, foldername} = reqPayload
        const _id = userId
        const find_user = await userModel.findOne({_id})
        if(!find_user){
            throw new Error("sorry user doesnot exist")
        }
        const owner = find_user.email
        const storagePath = path.join(defaultDir,userId,foldername)
        const newItem = new itemModel({
            userId: userId,
            name: foldername,
            size: 0,
            owner: owner,
            parentFolder: userId,
            type: 'FOLDER',
            extension: null,
            StoragePath: storagePath,
          })
        newItem.save()
        return { newItem }
    } catch (err) {
        throw err
    }
}

async function uploadDoc(reqPayload){
    try {
        const{userId, file} = reqPayload
        const filePath = path.join(defaultDir,userId,file.originalname)
        const writeFile = fs.writeFile(filePath, file.buffer, (err) =>{
            if(err){
                console.log(err)
                console.log("sorry file cant save")
                throw new Error('file cant be able to save')
            }
            console.log("file saved successfully")
            return {message : 'file saved successfully'}
        })
        const _id = userId
        const find_user = await userModel.findOne({_id})
        if(!find_user){
            throw new Error("sorry user doesnot exist")
        }
        const fileName = file.originalname
        const extension = fileName.split('.').pop()
        const owner = find_user.email
        const newItem = new itemModel({
            userId: userId,
            name: file.originalname,
            size: file.size,
            owner: owner,
            parentFolder: userId,
            type: 'FILES',
            extension: extension,
            StoragePath: filePath,
          })
        newItem.save()
        return{newItem}
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function shareDoc(reqPayload){
    try {
        const {ownerId, userMailId, itemId, permissionValue } = reqPayload
        const isOwner = await itemModel.findOne({_id : itemId, owner : ownerId})
        if(isOwner){
            const isExist = await permissionModel.findOne({userMailId : userMailId, itemId : itemId})
            if(isExist){
                throw new Error('sorry this User-Item combination already exist');
            }
            const newValue = new permissionModel({
                userMailId : userMailId,
                itemId : itemId,
                permissionValue : {
                    p : permissionValue
                }
        })
        newValue.save()
        return {newValue}
        }
        throw new Error("Sorry you are not the owner of this file!")
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function viewDoc(reqPayload){
    try {
        const { userId, itemId } =reqPayload
        
    } catch (err) {
        
    }


}

module.exports = {
    createRootFolder,newFolder,uploadDoc,viewDoc,shareDoc
}