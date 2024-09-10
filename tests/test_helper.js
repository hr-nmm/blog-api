const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)
let user
const getUser = async () => { user = await User.findOne({ username: 'root' }) }
getUser()
const initialBlogs = [{
  title: 'Unqualified Reservations',
  author: 'Curtis Yarvin',
  url: 'https://www.unqualified-reservations.org/',
  likes: 7144, user
}, {
  title: 'The Singularity is nearer',
  author: 'George Hotz',
  url: 'https://geohot.github.io/blog/',
  likes: 3627, user
}, {
  title: 'Marc Andreessen Substack',
  author: 'Marc Andreessen',
  url: 'https://pmarca.substack.com/',
  likes: 8599, user
}]


const blogsInDb = async () => {
  const contact = await Blog.find({})
  return contact.map(contact => contact.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}
const getToken = async () => {
  const loginResponse = await api.post('/api/login').send({ username: 'root', password: 'secretPWD@123' })
  const token = 'Bearer ' + JSON.parse(loginResponse.text).token
  return token
}
module.exports = { initialBlogs, blogsInDb, usersInDb, getToken }