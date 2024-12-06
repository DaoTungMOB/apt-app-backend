const AsyncExitHook = require('async-exit-hook')
const cors = require('cors')
require('dotenv').config()
const express = require('express')
const { env } = require('./config/environment')
const { closeDB, connectDB } = require('./config/mongodb')
const APIs_V1 = require('./routes/v1')
const morgan = require('morgan')
const errorHandlingMiddleware = require('./middlewares/errorHandlingMiddleware')

const startServer = () => {
  const app = express()

  app.use(morgan('dev'))
  app.use(cors())
  app.use(express.json())

  app.use('/v1', APIs_V1)

  app.use(errorHandlingMiddleware)

  app.listen(env.PORT, () => {
    console.log(`Server is running at ${env.HOST}:${env.PORT}`);
  })

  // Thực hiện các tác vụ cleanup trước khi dừng server
  AsyncExitHook(() => {
    closeDB()
  })
}

// Kết nối tới DB thành công mới start server
(async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB')

    startServer()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()
