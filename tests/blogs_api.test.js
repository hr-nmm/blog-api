const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const logger = require('../utils/logger')

const api = supertest(app)



describe('when there is initially some notes saved in testDB', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  describe('testing GET', () => {
    test('GET: returns 200:json and all blogs are returned', async () => {
      const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('unique identifier property of the blog posts is named id', async () => {
      const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
      assert('id' in response.body[0])
    })


  })
  describe('tesing GET:/id  single-resource', () => {
    test('single resource fetch', async () => {
      const blogsAtBeginning = await helper.blogsInDb()
      const blogToView = blogsAtBeginning[1] // singularity is nearer
      const response = await api.get(`/api/blogs/${blogToView.id}`).expect(200).expect('Content-Type', /application\/json/)
      assert.deepStrictEqual(response.body, blogToView)

    })
    test('single resouce fetch, 404 non-existing ID', async () => {
      const nonExistingID = '66d05e16d407cb4635745173'
      await api.get(`/api/blogs/${nonExistingID}`).expect(404)
    })


    test('single resouce fetch, 400 invalid ID', async () => {
      const invalidID = '66d05e16d407cb463574517c3'
      await api.get(`/api/blogs/${invalidID}`).expect(400)
    })
  })



  describe('testing POST', () => {
    test('POST: returns 201 and a vlid blog can be added', async () => {
      const response = await api.post('/api/blogs').send({
        title: 'monopath',
        author: 'solman pauss',
        url: 'https://ddsd.dsdsdddd.com/',
        likes: 8599,
      }).expect(201).expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.deepStrictEqual(response.body, blogsAtEnd[blogsAtEnd.length - 1])
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('POST: test likes functionality when passed w/o it', async () => {
      const response = await api.post('/api/blogs').send({
        title: 'without likes',
        author: 'solman pauss',
        url: 'https://ddsd.dsdsdddd.com/'
      }).expect(201).expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
      assert.strictEqual(response.body.likes, 0)
    })

    test('if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request.', async () => {
      await api.post('/api/blogs').send({
        title: 'without likes',
        author: 'solman pauss'
      }).expect(400)
      await api.post('/api/blogs').send({
        url: 'https://ddsd.dsdsdddd.com/',
        author: 'solman pauss',
      }).expect(400)
      await api.post('/api/blogs').send({
        url: 'https://ddsd.dsdsdddd.com/',
        author: 'solman pauss',
        likes: 222
      }).expect(400)
    }
    )
  })

  describe('testing DELETE', () => {
    test('delete a resource with valid id that exists', async () => {
      const blogsAtBeginning = await helper.blogsInDb()
      const blogToDelete = blogsAtBeginning[1] // singularity is nearer
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
      const contents = blogsAtEnd.map((ele) => { ele.title })
      assert(!contents.includes(blogToDelete.title))
    })
    test('delete resouce fetch, 404 non-existing ID', async () => {
      const nonExistingID = '66d05e16d407cb4635745173'
      await api.delete(`/api/blogs/${nonExistingID}`).expect(404)
    })


    test('delete resouce fetch, 400 invalid ID', async () => {
      const invalidID = '66d05e16d407cb463574517c3'
      await api.delete(`/api/blogs/${invalidID}`).expect(400)
    })
  })
  describe('testing PUT', () => {
    test('update a resource', async () => {
      const blogsAtBeginning = await helper.blogsInDb()
      const blogToUpdate = blogsAtBeginning[1] // singularity is nearer
      await api.put(`/api/blogs/${blogToUpdate.id}`).send({ ...blogToUpdate, likes: 420 }).expect(200).expect('Content-Type', /application\/json/)
      const blogsAtEnd = await helper.blogsInDb()
      assert.equal(blogsAtEnd[1].likes, 420)
      assert.deepStrictEqual(blogsAtEnd[1], { ...blogToUpdate, likes: 420 })
    })
  })

})


after(async () => {
  await mongoose.connection.close()
  logger.info('connection closed')
})