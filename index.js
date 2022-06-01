// Access environment variables
import dotenv from 'dotenv'
dotenv.config()

// // Connect to MongoDB database
// // Connection pool is established near the beginning of the express file
// // so that it is accessible to all routes and middleware
// import mongoose from 'mongoose'
// // The connection pool is established in the models/database.js file
// // this allows the database connection to be written once and used in
// // both the express app and in integration and unit tests which are run
// // from different scripts
// import connect from './models/database.js'
// connect(process.env.DB_URL)
// // Logs the connection status to the console
// mongoose.connection.on('open', () => console.log(`Database --> Connected to database "${mongoose.connection.name}"`))
// mongoose.connection.on('error', (err) => console.log(`Database --> Error connecting to database "${mongoose.connection.name}"`, err))

// Instantiate DB connection and connect to database
import DbConnection from './models/database.js'
const conn = new DbConnection(process.env.DB_URL)
conn.connect()

// Instantiate application
import app from './app.js'
const server = app()

// // // // Load up test data
// import pushMockData from './__test__/pushMockData.js'
// const pushData = () => {return pushMockData(['all'])}
// // pushData()
// server.use(async (req, res, next) => {
//     if(await mongoose.model("User").countDocuments() === 0) {
//         console.log(pushData())
//     }
//     next()

// })
const PORT = process.env.PORT
// Run server
server.listen(PORT, () => {
    console.log(`Server --> Server is running on port ${PORT}`)
})





