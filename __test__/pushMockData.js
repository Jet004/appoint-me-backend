import User from '../models/userModel'
import TempUser from '../models/tempUserModel'
import mockUsers from '../__test__/mockUsers'
import mockTempUsers from '../__test__/mockTempUsers'

export const pushMockUsers = async () => {
    const query = mockUsers.map(user => {
        return {
            insertOne: {
                document: user
            }
        }
    })

    const result = await User.bulkWrite(query)
    // console.log('Mock users pushed to database: ', result.insertedCount)
}

export const pushMockTempUsers = async () => {
    const query = mockTempUsers.map(tempUser => {
        return {
            insertOne: {
                document: tempUser
            }
        }
    })

    const result = await TempUser.bulkWrite(query)
    // console.log('Mock temp users pushed to database: ', result.insertedCount)
}

const pushMockData = async () => {
    await pushMockUsers()
    await pushMockTempUsers()
}

export default pushMockData
