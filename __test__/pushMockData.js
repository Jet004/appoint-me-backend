
const User = require('../models/userModel')
const TempUser = require('../models/tempUserModel')
const mockUsers = require('./mockUsers')
const mockTempUsers = require('./mockTempUsers')

module.exports.pushMockUsers = () => {
    const query = mockUsers.map(user => {
        return {
            insertOne: {
                document: user
            }
        }
    })

    return User.bulkWrite(query)
        .then((res) => {
            console.log('Mock users pushed to database: ', res.insertedCount)
        })
}

module.exports.pushMockTempUsers = () => {
    const query = mockTempUsers.map(tempUser => {
        return {
            insertOne: {
                document: tempUser
            }
        }
    })

    return TempUser.bulkWrite(query)
        .then((res) => {
            console.log('Mock temp users pushed to database: ', res.insertedCount)
        })
}