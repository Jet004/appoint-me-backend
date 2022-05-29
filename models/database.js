import mongoose from "mongoose"

const connect = async (url) => {
    // Connect to database with mongoose
    await mongoose.connect(url, 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        })
}

// export default connect

export default class DbConnection {
    constructor(url) {
        this.connectionString = url
    }

    connect() {
        mongoose.connect(this.connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        mongoose.connection.on('open', () => console.log(`Database --> Connected to database "${mongoose.connection.name}"`))
        mongoose.connection.on('error', (err) => console.log(`Database --> Error connecting to database "${mongoose.connection.name}"`, err))
    }

    async dropDb() {
        await mongoose.connection.dropDatabase()
        console.log(`Database --> Dropped database "${mongoose.connection.name}"`)
    }

    async close() {
        await mongoose.disconnect()
        console.log(`Database --> Disconnected from database "${mongoose.connection.name}"`)
    }
}