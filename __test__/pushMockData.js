import User from '../models/userModel'
import TempUser from '../models/tempUserModel'
import BusinessRep from '../models/businessRepModel'
import Business from '../models/businessModel'
import mockUsers from './mockUsers'
import mockTempUsers from './mockTempUsers'
import mockBusinessReps from './mockBusinessReps'
import mockBusiness from './mockBusiness'

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

export const pushMockBusinessReps = async () => {
    const query = mockBusinessReps.map(rep => {
        return {
            insertOne: {
                document: rep
            }
        }
    })

    const result = await BusinessRep.bulkWrite(query)
    // console.log('Mock business representatives pushed to database: ', result.insertedCount)
}

export const pushMockBusiness = async () => {
    const query = mockBusiness.map(business => {
        return {
            insertOne: {
                document: business
            }
        }
    })

    const result = await Business.bulkWrite(query)
    // console.log('Mock businesses pushed to database: ', result.insertedCount)
}

const pushMockData = async (functionArray) => {

    const functions = {
        users: pushMockUsers,
        tempUsers: pushMockTempUsers,
        businessReps: pushMockBusinessReps,
        business: pushMockBusiness
    }

    for (let [key, value] of Object.entries(functions)) {
        if (functionArray.includes(key)) {
            await value()
        }
    }
}

export default pushMockData
