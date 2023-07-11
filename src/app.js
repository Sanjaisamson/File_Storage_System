const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/userRouter')
const { errorHandler } = require('./middlewares/errorHandler.middleware')
const app = express();

const PORT  = process.env.PORT || 3500

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', userRouter);
app.use(errorHandler)

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})