const dbConfig = {
    dbHost: process.env.DB_HOST || '127.0.0.1',
    dbName : process.env.DB_NAME 
}


module.exports = {dbConfig}
