const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
  if (user) {
    if (passwordCorrect) {
      const userForToken = { username: user.username, id: user._id, }
      // token expires in 60*60 seconds, that is, in one hour
      const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })
      res.status(200).send({ token, username: user.username, name: user.name })

    } else return res.status(401).json({ error: 'invalid password' })
  } else return res.status(401).json({ error: 'invalid username' })

})

module.exports = loginRouter