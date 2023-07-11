const httpErrors = require('http-errors')


function errorHandler(err, req, res, next){
    if(err){
        const error = err.status || 407
        res.status(error);
        res.send({
            errorFound : {
                status : err.status,
                message : err.message
            }
        })
    }
}

module.exports = {
    errorHandler
}