const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const logger = require('../utils/logger')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('users_api test', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('secretPWD@123', 10)
    const user = new User({ username: 'root', name: 'root Name', passwordHash: passwordHash })
    await user.save()
  })

  test('1. creation succeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = { username: 'root999', name: 'Root999 Name', password: 'pwdroot999', }
    await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    const usernames = usersAtEnd.map((user) => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('2. creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = { username: 'root', name: 'Superuser', password: 'xccxefghji', }
    const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert.strictEqual(JSON.parse(result.text).code, 11000) // 11000 is code for error: unique field mongoDB
  })

})

after(async () => {
  await mongoose.connection.close()
  logger.info('conn closeddddd')
})