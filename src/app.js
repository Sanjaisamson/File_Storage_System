const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/userRouter')
const itemRouter = require('./routes/itemRouter')
const { errorHandler } = require('./middlewares/errorHandler.middleware')
const connectDB = require('./db/dbConnection')
const app = express();

const PORT = process.env.PORT || 3500

connectDB();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/items', itemRouter)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})