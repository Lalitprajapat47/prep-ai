const express = require('express')
const app = express()
app.use(express.json())
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const cors = require('cors')
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

// require all route related to auth
const authRouter = require('./routes/auth.route')
app.use('/api/auth', authRouter)


module.exports = app