const express = require('express')
const app = express()
app.use(express.json())
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const cors = require('cors')
app.use(cors({
   origin: [
        'http://localhost:5173',
        'https://prep-ai-navy-nine.vercel.app'
    ],
    
    credentials:true
}))

// require all route here
const authRouter = require('./routes/auth.route')
const interviewRouter = require('./routes/interview.route')

// using all routes here
app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)

module.exports = app