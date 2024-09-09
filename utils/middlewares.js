const jwt = require('jsonwebtoken')
const User = require('../models/user')
const tokenExtractor = (request, _, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request['token'] = authorization.substring(7)
  }
  next()
}
const tokenValidator = async (request, response, next) => {
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    request.user = null
  } else {
    request.user = await User.findById(decodedToken.id)
  }
  next()
}
module.exports = { tokenExtractor, tokenValidator }