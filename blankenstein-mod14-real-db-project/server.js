const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')

const students = require('./routes/students')

dotenv.config({ path: './config/config.env' })
connectDB()
const PORT = process.env.PORT || 5000
const app = express()
// Parse JSON
app.use(express.json( ))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use('/api/v1/students', students)

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err}`)
  server.close(() => process.exit(1))
})
