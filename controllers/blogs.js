const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const logger = require('../utils/logger')

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
blogsRouter.get('/', async (_, res) => {
  // Blog.find({}).then((blogs) => {
  //   res.json(blogs)
  // })
  const blogs = await Blog.find({})
  res.json(blogs)
})

// read single resouce by id
blogsRouter.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (blog) res.json(blog)
    else res.status(404).end()
  } catch (error) {
    res.status(400).json(error)
  }
})

// create resource
blogsRouter.post('/', async (req, res) => {
  const request = req.body
  if (!('title' in request && 'url' in request)) {
    res.sendStatus(400)
  } else {
    if (!('likes' in request)) {
      request['likes'] = 0
    }
    const blog = new Blog(request)
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
  }
})

// delete resource
blogsRouter.delete('/:id', async (req, res) => {
  try {
    const response = await Blog.findByIdAndDelete(req.params.id)
    if (response) res.status(204).end()
    else res.status(404).end()
  } catch (error) {
    res.status(400).json(error)
  }

})

// update resource
blogsRouter.put('/:id', async (req, res) => {
  try {
    const { title, author, url, likes } = req.body
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { title, author, url, likes }, { new: true, runValidators: true, context: 'query' })
    res.json(updatedBlog)
  } catch (error) {
    res.json(error)
  }
})

module.exports = blogsRouter
