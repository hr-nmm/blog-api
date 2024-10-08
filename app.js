// imports
const config = require('./utils/config')
const express = require('express')
const app = express()
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const middlewares = require('./utils/middlewares')

// connect to DB
mongoose.set('strictQuery', false)
logger.info('connecting to ', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info('connected to MongoDB')
})

// use middlewares
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middlewares.tokenExtractor)
app.use(middlewares.tokenValidator)
app.use('/api/blogs', blogsRouter)

module.exports = app
