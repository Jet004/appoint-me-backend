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
        .escape(),
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