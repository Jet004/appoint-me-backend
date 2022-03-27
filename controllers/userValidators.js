import { body, param } from 'express-validator'

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
    // Validate address fields
    body('address.unit')
        .optional()
        .isNumeric({no_symbols: true}).withMessage('Unit number must be numeric')
        .isLength({min: 1, max: 6}).withMessage('Unit number must be between 1 and 6 digits long')
        .trim()
        .escape(),
    body('address.streetNumber')
        .exists({checkFalsy: true}).withMessage('Street number is required')
        .isNumeric({no_symbols: true}).withMessage('Street number must be numeric')
        .isLength({min: 1, max: 6}).withMessage('Street number must be between 1 and 6 digits long')
        .trim()
        .escape(),
    body('address.streetName')
        .exists({checkFalsy: true}).withMessage('Street name is required')
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('Street name must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 100}).withMessage('Street name must be between 2 and 100 characters')
        .trim()
        .escape(),
    body('address.city')
        .exists({checkFalsy: true}).withMessage('City is required')
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('City must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 100}).withMessage('City must be between 2 and 100 characters')
        .trim()
        .escape(),
    body('address.state')
        .exists({checkFalsy: true}).withMessage('State is required')
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('State must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 100}).withMessage('State must be between 2 and 100 characters')
        .trim()
        .escape(),
    body('address.postCode')
        .exists({checkFalsy: true}).withMessage('Postcode is required')
        .isNumeric({no_symbols: true}).withMessage('Postcode must be numeric')
        .isLength({min: 4, max: 4}).withMessage('Postcode must be 4 digits long')
        .trim()
        .escape(),
    body('address.country')
        .exists({checkFalsy: true}).withMessage('Country is required')
        .isAlpha().withMessage('Country must be letters')
        .isLength({min: 2, max: 100}).withMessage('Country must be between 2 and 100 characters')
        .trim()
        .escape(),
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
    // Validate address fields
    body('address.unit')
        .optional()
        .isNumeric({no_symbols: true}).withMessage('Unit number must be numeric')
        .isLength({min: 1, max: 6}).withMessage('Unit number must be between 1 and 6 digits long')
        .trim()
        .escape(),
    body('address.streetNumber')
        .optional()
        .isNumeric({no_symbols: true}).withMessage('Street number must be numeric')
        .isLength({min: 1, max: 6}).withMessage('Street number must be between 1 and 6 digits long')
        .trim()
        .escape(),
    body('address.streetName')
        .optional()
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('Street name must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 100}).withMessage('Street name must be between 2 and 100 characters')
        .trim()
        .escape(),
    body('address.city')
        .optional()
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('City must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 100}).withMessage('City must be between 2 and 100 characters')
        .trim()
        .escape(),
    body('address.state')
        .optional()
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('State must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 100}).withMessage('State must be between 2 and 100 characters')
        .trim()
        .escape(),
    body('address.postCode')
        .optional()
        .isNumeric({no_symbols: true}).withMessage('Postcode must be numeric')
        .isLength({min: 4, max: 4}).withMessage('Postcode must be 4 digits long')
        .trim()
        .escape(),
    body('address.country')
        .optional()
        .isAlpha().withMessage('Country must be letters')
        .isLength({min: 2, max: 100}).withMessage('Country must be between 2 and 100 characters')
        .trim()
        .escape(),
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

// This function checks for unexpected keys in the request body

const checkForUnexpectedKeys = (acceptedKeys, keysToCheck) => {
    let unexpectedKeys = []
    keysToCheck.forEach(key => {
        if(!acceptedKeys.includes(key)) {
            unexpectedKeys.push(key)
        }
    })     

    return unexpectedKeys
}

// Return 400 Bad Request if there are unexpected keys in the request body
export const checkKeys = (req, res, next) => {
    const acceptedKeys = ["_id", "email", "fname", "lname", "password", "phone", "address", "dob", "appointments", "createdAt", "updatedAt", "__v"]
    const acceptedAddressKeys = ["unit", "streetNumber", "streetName", "suburb", "city", "state", "postCode", "country", "createdAt", "updatedAt", "__v"]

    const unexpectedKeys = []
    const userKeys = Object.keys(req.body)
    unexpectedKeys.push(...checkForUnexpectedKeys(acceptedKeys, userKeys))

    if(req.body.address !== undefined) {
        const addressKeys = Object.keys(req.body.address)
        unexpectedKeys.push(...checkForUnexpectedKeys(acceptedAddressKeys, addressKeys))
    }

    if (unexpectedKeys.length > 0) {
        // Return the response to prevent the request from continuing
        return res.status(400).json({
            status: "error",
            message: `Invalid key(s): ${unexpectedKeys.join(", ")}`
        })
    }  
    
    next()
}