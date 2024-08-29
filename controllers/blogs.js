const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

// get info
blogsRouter.get('/info', (_, res) => {
  Blog.estimatedDocumentCount().then((result) => {
    res.send(
      `<p>
          Blog-api has info for ${result} writers <br />
          ${new Date()}
        </p>`
    )
  })
})

// read all
blogsRouter.get('/', (_, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs)
  })
})

// create resource
blogsRouter.post('/', (req, res) => {
  const blog = new Blog(req.body)
  blog
    .save()
    .then((result) => {
      res.status(201).json(result)
    })
    .catch((error) => {
      logger.error(error)
    })
})

module.exports = blogsRouter
