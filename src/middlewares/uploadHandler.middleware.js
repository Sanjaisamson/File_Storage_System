const multer = require('multer');
const allowedFileTypes = require('../config/allowedFileTypes')


function customFileFilter(_req, file, cb) {
    const fileTypeCheck = allowedFileTypes.includes(file.mimetype)
    if (fileTypeCheck) {
        cb(null, true)
    } else {
        cb(new Error('File is not acceptable'), false)
    }
}

const fileUpload = multer({ fileFilter: customFileFilter }).single('file')

module.exports = fileUpload