const mongoose = require('mongoose')

const connect = async (url) => {
    // Connect to database with mongoose
    await mongoose.connect(url, 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        })
}

export default connect