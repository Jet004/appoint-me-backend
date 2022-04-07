import { body, param } from 'express-validator'
import checkForUnexpectedKeys from './checkBodyKeys'
import { validateAddressRequired, validateAddressOptional } from './addressValidators'

// This file sets out all of the validators for the user, tempUser and businessRep routes

// User validators common to all three user types
export const userValidator = [
    body('email')
        .isEmail().withMessage('Email must be valid'),
    body('fname')
        .exists({checkFalsy: true}).withMessage('First name is required')
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('First name must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 30}).withMessage('First name must be between 2 and 30 characters')
        .trim()
        .escape(),
    body('lname')
        .exists({checkFalsy: true}).withMessage('Last name is required')
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('Last name must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 30}).withMessage('Last name must be between 2 and 30 characters')
        .trim()
        .escape(),
    body('phone')
        .exists({checkFalsy: true}).withMessage('Phone number is required')
        .isNumeric({no_symbols: true}).withMessage('Phone number must be numeric')
        .isLength({min: 8, max: 10}).withMessage('Phone number must be 8 - 10 digits long')
        .trim()
        .escape()
]

// Validators for user and businessRep routes
export const ubrValidator = [
    body('dob')
        .exists({checkFalsy: true}).withMessage('Date of birth is required')
        .isISO8601().withMessage('Date of birth must be in ISO 8601 format')
        .trim()
        .escape(),
    validateAddressRequired
]

// validators for temp user routes
export const tempUserValidator = [
    // If any of the optional fields (other than unit number) are not present, 
    // delete the object from the request body
    (req, res, next) => {
        const dob = req.body.dob
        if(!dob) delete req.body.dob

        const address = req.body.address
        if (address) {
            if(!address.streetNumber || !address.streetName || !address.city || !address.state || !address.postCode || !address.country) {
                delete req.body.address
            }
        }   
        next()
    },
    body('dob')
        .optional()
        .isISO8601().withMessage('Date of birth must be in ISO 8601 format')
        .trim()
        .escape(),
    validateAddressOptional
]

// Password validator for user and businessRep
export const passwordValidator = [
    body('password')
        .exists({checkFalsy: true}).withMessage('Password is required')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$-_!%*?&])[A-Za-z\d@$-_!%*?&]{6,50}$/).withMessage('Password must be at least 6 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character')
        .trim()
        .escape(),
]

// Email param validator
export const emailValidator = [
    param('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .trim()
        .escape(),
]

// Mongoose ObjectId param validator
export const idValidator = [
    param('id')
        .isMongoId()
        .withMessage('Please enter a valid ID')
        .trim()
        .escape()
]

// Mongoose ObjectId param validator
export const businessIdValidator = [
    param('businessId')
        .isMongoId()
        .withMessage('Please enter a valid ID')
        .trim()
        .escape()
]

// Return 400 Bad Request if there are unexpected keys in the request body
export const checkKeys = (req, res, next) => {
    const acceptedKeys = [
        "_id", 
        "email",
        "fname", 
        "lname", 
        "password", 
        "phone", 
        "address", 
        "dob", 
        "appointments", 
        "createdAt", 
        "updatedAt", 
        "__v",
        "address.unit",
        "address.streetNumber",
        "address.streetName",
        "address.city",
        "address.state",
        "address.postCode",
        "address.country",
        "address.createdAt",
        "address.updatedAt",
        "address.__v",
    ]

    let  unexpectedKeys = checkForUnexpectedKeys(acceptedKeys, req.body)

    if (unexpectedKeys.length > 0) {
        // Return the response to prevent the request from continuing
        return res.status(400).json({
            status: "error",
            message: `Invalid key(s): ${unexpectedKeys.join(", ")}`
        })
    }  
    
    next()
}

export const isAuthorisedToCreateBusinessRep = () => (req, res, next) => {
    // This validator will change once admin panel implemented to handle multiple employees
    // Reject all requests for the time being
    return res.status(403).json({ status: "Forbidden", message: "You are not authorised to create a business representative" })
}

export const isOwnAccount = () => (req, res, next) => {
    if(req.session.user._id.toString() !== req.params.id.toString()) {
        return res.status(403).json({ status: "Forbidden", message: "You are not authorised to edit this account" })
    }
    return next()
}