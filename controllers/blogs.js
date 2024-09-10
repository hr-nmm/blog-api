const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const User = require('../models/user')
// const jwt = require('jsonwebtoken')
// // const logger = require('../utils/logger')

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
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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
  try {
    const body = req.body
    const user = req.user
    const blog = new Blog({ title: body.title, author: body.author, url: body.url, likes: body.likes, user: user._id })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
  } catch (error) {
    res.status(400).json(error).end()
  }
})

// delete resource
blogsRouter.delete('/:id', async (req, res) => {
  try {
    const user = req.user
    const blogId = req.params.id
    const blogToDelete = await Blog.findById(blogId)

    if (blogToDelete.user.toString() === user.id) {
      await Blog.findByIdAndDelete(blogId)
      res.status(204).end()
    }
    else res.status(401).json({ error: 'Unauthorized to delete the blog' })

  } catch (error) {
    if (error.name === 'TypeError') res.status(404).end()
    else if (error.name === 'CastError') res.status(400).json(error)

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
