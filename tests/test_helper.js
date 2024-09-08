const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [{
  title: 'Unqualified Reservations',
  author: 'Curtis Yarvin',
  url: 'https://www.unqualified-reservations.org/',
  likes: 7144,
}, {
  title: 'The Singularity is nearer',
  author: 'George Hotz',
  url: 'https://geohot.github.io/blog/',
  likes: 3627,
}, {
  title: 'Marc Andreessen Substack',
  author: 'Marc Andreessen',
  url: 'https://pmarca.substack.com/',
  likes: 8599,
}]


const blogsInDb = async () => {
  const contact = await Blog.find({})
  return contact.map(contact => contact.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { initialBlogs, blogsInDb, usersInDb }