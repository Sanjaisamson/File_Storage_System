
const jwt = require('jsonwebtoken')
require('dotenv').config()
const httpErrors = require('http-errors')

function readUser(){
    const user = {
        username : 'shibu',
        address : 'shibu villa',
        Ph_no : '4566383783',
        password: 'shibu123'
    }
    return{user}
}

async function newUser(signupData){
    try {
        const {username, password, email} = signupData
        if(!username,!password,!email){
            throw err;
        }
        const user = username;
        const accessToken = await jwt.sign(
            {user},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : "30s"}
        )
        console.log(accessToken)
        const refreshToken = await jwt.sign(
            {user},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn : "2m"}
        )
    return {accessToken: accessToken,refreshToken: refreshToken, username, password, email}
    } catch (err) {
        console.log(err)
        throw err
    }
}

module.exports = {
    newUser,readUser
}