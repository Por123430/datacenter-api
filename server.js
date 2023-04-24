require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const { logEvent } = require('./middleware/logger')

const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
// const ImageModel = require("./models/Image")

app.use('/auth', require('./routes/authRoutes'))
app.use('/notiimage', require('./routes/imageRoutes'))

app.use('/notiHumi', require('./routes/notiHumiRoutes'))
app.use('/notiTemp', require('./routes/notiTempRoutes'))
app.use('/notiLight', require('./routes/notiLightRoutes'))
// app.use('/notiCamera', require('./routes/notiCameraRoutes'))
app.use('/sensor',require('./routes/sonserRoutes'))
// app.use('/activity', require('./routes/activityRoutes'))
//app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/moniters', require('./routes/monitorRoutes'))

app.all('*', (req, res) =>{
    res.status(404)
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')){
        res.json({ message: '404 Not Found'})
    } else {
        res.type('test').send('404 Not Found')
    }
})

app.use(errorHandler)


mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`server running on port ${PORT}`))
})

mongoose.connection.on('error',err =>{
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrLog.log')
})
