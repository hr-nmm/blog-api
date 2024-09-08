// imports
const config = require('./utils/config')
const express = require('express')
const app = express()
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')

// connect to DB
mongoose.set('strictQuery', false)
logger.info('connecting to ', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info('connected to MongoDB')
})

// use middlewares
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
module.exports = app
