require('dotenv').config()
const PORT = process.env.PORT
const MONGODB_URI =
  process.env.DATABASE_ACCOUNT_URL +
  process.env.DATABASE_PASSWORD +
  process.env.DATABASE_CLUSTER_ID
module.exports = { PORT, MONGODB_URI }
