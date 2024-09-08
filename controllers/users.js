const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  if (password.length > 3) {
    try {
      const passwordHash = await bcrypt.hash(password, 10)
      const user = new User({
        username: username, name: name, passwordHash: passwordHash
      })
      const savedUser = await user.save()
      res.status(201).json(savedUser)

    } catch (error) {
      res.status(400).json(error)
    }
  } else res.status(400).send('<p>password must be atleast 3 characters</p>')

})

usersRouter.get('/', async (_, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  res.json(users)
})

module.exports = usersRouter