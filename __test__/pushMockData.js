import User from '../models/userModel.js'
import TempUser from '../models/tempUserModel.js'
import BusinessRep from '../models/businessRepModel.js'
import Business from '../models/businessModel.js'
import mockUsers from './mockUsers.js'
import mockTempUsers from './mockTempUsers.js'
import mockBusinessReps from './mockBusinessReps.js'
import mockBusiness from './mockBusiness.js'
import { services } from './mockBusiness.js'

import dotenv from 'dotenv'
dotenv.config()

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
        if(process.env.NODE_ENV === "test"){
            return {
                insertOne: {
                    document: business
                }
            }
        } else {
            business.services.push(...services)
            return {
                insertOne: {
                    document: business
                }
            }
        }
    })

    const result = await Business.bulkWrite(query)
    // console.log('Mock businesses pushed to database: ', result.insertedCount)
}

const pushMockData = async (functionArray) => {
    if(functionArray[0] === "all"){
        functionArray = ["users", "tempUsers", "businessReps", "businesses"]
    }

    const functions = {
        users: pushMockUsers,
        tempUsers: pushMockTempUsers,
        businessReps: pushMockBusinessReps,
        businesses: pushMockBusiness
    }

    for (let [key, value] of Object.entries(functions)) {
        if (functionArray.includes(key)) {
            await value()
        }
    }
    return true
}

export default pushMockData
