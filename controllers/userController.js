import { hashSync } from "bcrypt"
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// This controller is not needed at the moment, it is still here 
// so the related imports don't throw errors
export const getAllUsers = (DbGetAllUsers) => async (req, res) => {
    try {
        const users = await DbGetAllUsers()
        
        if(users) {
            res.status(200).json({ status: "success", user: users })
        } else {
            res.status(500).json({ status: "error", message: "An unexpected error occurred" })
        }
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const getUserByEmail = (DbGetUserByEmail) => async (req, res) => {
    try {
        // Get user by email
        const user = await DbGetUserByEmail(req.params.email)
        // Check if user exists
        if(user) {
            // Remove password from response
            const { password, ...responseUser } = user._doc
            res.status(200).json({ status: "success", user: responseUser })
        } else {
            res.status(404).json({ status: "not found", user: [] })
        }
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const createUser = (DbCreateUser) => async (req, res) => {
    try {
        const user = req.body
        user.password = hashSync(user.password, 6)
        // Create user
        const result = await DbCreateUser(user)
        // Check if user was created
        result ? res.status(201).json({ status: "success", user: result })
            : res.status(500).json({ status: "error", message: "An unexpected error occurred" })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const updateUser = (DbUpdateUser) => async (req, res) => {
    try {
        const result = await DbUpdateUser(req.params.id, req.body)
        console.log("RESULT: ",result)
        result ? res.status(200).json({ status: "success", message: "Data updated successfully", originalData: result })
            : res.status(404).json({ status: "not found", user: [] })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const deleteUser = (DbDeleteUser) => async (req, res) => {
    try {
        // CRMs and Appointments will cascade delete when user / temp 
        // user deleted. The logic for this is handled in the model
        
        const result = await DbDeleteUser(req.params.id)

        result ? res.status(204).json()
            : res.status(404).json({ status: "not found" })

    } catch (e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const createTempUser = (DbCreateUser, DbCreateCRM) => async (req, res) => {
    try {
        const user = req.body
        // Create a temp user
        const result = await DbCreateUser(user)

        // Check if the user was created
        if(!result) {
            return res.status(500).json({ status: "error", message: "An unexpected error occurred" })
        }

        // Create a CRM for the user
        const crm = {
            userModel: "TempUser",
            user: result._id,
            business: req.params.businessId,
            tempFlag: true,
            appointments: [],
            allowAccess: true,
            notes: "This is a temporary user created for the business"
        }

        const crmResult = await DbCreateCRM(crm)

        // Check if the CRM was created successfully
        if(!crmResult) {
            return res.status(500).json({ status: "error", message: "An unexpected error occurred" })
        }
        
        // Return the created user
        res.status(201).json({ status: "success", message: "Client added successfully", user: result })

    } catch (e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const getProfilePicture = (req, res) => {
    // Require id and userType
    const id = req.params.id
    const userType = req.params.userType
console.log(userType)
    try {
        // Get directory name based on userType
        let dirName
        if(userType === 'user'){
            dirName = "userProfilePics"
        } else if(userType === 'businessRep'){
            dirName = 'repProfilePics'
        } else {
            throw new Error("Invalid user type")
        }

        let profilePicture
        let filePath = `./images/${dirName}/${id}`
        // Check that file exists with one of the accepted extensions
        if(fs.existsSync(`${filePath}.jpg`)){
            profilePicture = fs.readFileSync(`${filePath}.jpg`)
            filePath = `${filePath}.jpg`
        } else if(fs.existsSync(`${filePath}.jpeg`)){
            profilePicture = fs.readFileSync(`${filePath}.jpeg`)
            filePath = `${filePath}.jpeg`
        } else if(fs.existsSync(`${filePath}.png`)){
            profilePicture = fs.readFileSync(`${filePath}.png`)
            filePath = `${filePath}.png`
        } else {
            res.status(404).json({ status: "error", message: "File not found" })
        }

        console.log(filePath)
        return res.status(200).sendFile(filePath, { root: path.join(__dirname, '/../') })
       
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message });
    }
}

export const saveProfilePicture = (req, res) => {
    try {
        // Get file
        console.log(req.params)
        const file = req.files.file
        // Check file extension
        let fileExtension = file.name.split('.')[1]
        const allowedExtensions = ["png", "jpg", "jpeg"]

        if(!allowedExtensions.includes(fileExtension)){
            // Wrong file type, respond with bad request
            return res.status(400).json({error: "Invalid file type"})
        }

        // Define the file path
        let filePath
        if(req.session.userType === 'user') {
            filePath = `${__dirname}/../images/userProfilePics/${req.params.id}.${fileExtension}`
        } else if(req.session.userType === 'businessRep'){
            filePath = `${__dirname}/../images/repProfilePics/${req.params.id}.${fileExtension}`
        }

        // Check if a file already exists
        if(fs.existsSync(filePath)) {
            // Delete the file
            fs.rmSync(filePath)
        }

        // Save new file to file path
        file.mv(filePath, (error) => {
            // Check if there were any file upload errors
            if(error){
                // There was an upload error, log error and respond with server error
                console.log(error)
                res.status(500).json({ status: "error", message: error })
            } else {
                // File upload successful, respond with 200 OK
                res.status(200).json({
                    status: "success",
                    message: "File upload successful"
                })
            }
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({ status: "error", message: e.message })
    }
}

export const getAssociatedBusiness = (DbGetAssociatedBusiness) => async (req, res) => {
    try {
        const repId = req.params.id
        const result = await DbGetAssociatedBusiness(repId)
        result ? res.status(200).json({ status: "success", message: "Associated business found", business: result })
            : res.status(404).json({ status: "error", message: "No associated business found" })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ status: "error", message: e.message });
    }
}