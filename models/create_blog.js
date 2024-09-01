// imports
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)
mongoose.connect(process.env.DATABASE_ACCOUNT_URL + process.env.DATABASE_PASSWORD + process.env.TEST_DATABASE_CLUSTER_ID) // in testDB

// create schema for model

const blogSchema = mongoose.Schema({ title: String, author: String, url: String, likes: Number, })
const Blog = mongoose.model('Blog', blogSchema)

if (process.argv.length < 6) {
  Blog.find({}).then((result) => {
    result.forEach((blog) => { console.log(blog) })
    mongoose.connection.close()
  })
} else {
  const title = process.argv[2],
    author = process.argv[3],
    url = process.argv[4],
    likes = process.argv[5]
  const blog = new Blog({ title: title, author: author, url: url, likes: likes })
  blog.save().then((result) => {
    console.log('note saved!', result)
    mongoose.connection.close()
  })
}