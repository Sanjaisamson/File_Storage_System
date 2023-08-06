
function errorHandler(err, req, res, next){
    if(err){
        const error = err.status || 500
        res.status(error);
        res.send({
            error : {
                status : err.status,
                message : err.message
            }
        })
    }
}

module.exports = {
    errorHandler
}