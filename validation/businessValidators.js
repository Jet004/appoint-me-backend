import { body, param } from 'express-validator'
import { validateAddressRequired } from './addressValidators'
import checkForUnexpectedKeys from './checkBodyKeys'

// This file sets out all of the input validators for a business entity

export const businessValidator = [
    body("abn")
        .exists({checkFalsy: true}).withMessage('ABN is required')
        .isNumeric({no_symbols: true}).withMessage('ABN must be numeric')
        .isLength({min: 9, max: 11}).withMessage('ABN must be between 9 and 11 digits long')
        .trim()
        .escape(),
    body("name")
        .exists({checkFalsy: true}).withMessage('Name is required')
        .isAlpha('en-AU', {ignore: ". '-"}).withMessage('Business name must be Alphabetical')
        .isLength({min: 1, max: 100}).withMessage('Buisness name must be between 1 and 100 characters long')
        .trim()
        .escape(),
    validateAddressRequired,
    body("phone")
        .exists({checkFalsy: true}).withMessage('Phone number is required')
        .isNumeric({no_symbols: true}).withMessage("Phone number must be numeric")
        .isLength({min: 8, max: 10}).withMessage("Phone number must be between 8 and 10 numbers long")
        .trim()
        .escape(),
    body("email")
        .isEmail()
        .trim()
        .escape(),
    body("businessRep")
        .isMongoId()
        .trim()
        .escape(),
]

export const serviceValidator = [
    body('name')
        .exists({checkFalsy: true}).withMessage("Name is required")
        .isAlphanumeric("en-AU", {ignore: ".,' -_@"}).withMessage("Name can only contain numbers and letters")
        .isLength({min: 2, max: 50}).withMessage("Name must be between 2 and 50 characters long")
        .trim()
        .escape(),
    body("description")
        .exists({checkFalsy: true}).withMessage("Description is required")
        .isAlphanumeric("en-AU", {ignore: ".,' -_@"}).withMessage("Description can only contain numbers and letters")
        .isLength({min: 2, max: 2000}).withMessage("Description must be between 2 and 2000 characters long")
        .trim()
        .escape(),
    body("duration")
        .exists({checkFalsy: true}).withMessage("Duration is required")
        .isNumeric({no_symbols: true}).withMessage("Duration can only contain numbers")
        .isLength({min: 1, max: (24 * 60 * 60 )}).withMessage("Duration must be between 1 minute and one day long")
        .trim()
        .escape(),
    body("bookingTimes")
        .optional(),
    body("break")
        .exists({checkFalsy: true}).withMessage("Break is required")
        .isNumeric({no_symbols: true}).withMessage("Break can only contain numbers")
        .isLength({min: 0, max: (24 * 60 * 60)}).withMessage("Break must be between 0 minutes and 1 day long")
        .trim()
        .escape(),
    body("fee")
        .exists({checkFalsy: true}).withMessage("Fee is required")
        .isNumeric({no_symbols: true}).withMessage("Fee can only contain Numbers")
        .isLength({min: 0, max: 10000000}).withMessage("Fee must be between 0 and 1000000")
        .trim()
        .escape()
]

export const idValidator = [
    param('id')
        .exists({checkFalsy:true}).withMessage('ID is required')
        .isMongoId().withMessage('ID must be a valid Mongo ID')
        .isLength({min:1, max:40}).withMessage('ID must be between 1 and 40 characters')
        .trim()
        .escape()
]

export const abnValidator = [
    param('abn')
        .exists({checkFalsy:true}).withMessage('ABN is required')
        .isNumeric({no_symbols:true}).withMessage('ABN must be numeric')
        .isLength({min:9, max:11}).withMessage('ABN must be between 9 and 11 digits long')
        .trim()
        .escape()
]

export const checkKeys = (req, res, next) => {
    const acceptedKeys = [
        "_id",
        "abn",
        "name",
        "phone",
        "email",
        "businessRep",
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
        "address.__v"
    ]

    const unexpectedKeys = checkForUnexpectedKeys(acceptedKeys, req.body)
    console.log("unexpected keys: ", unexpectedKeys)
    if(unexpectedKeys.length > 0) {
        // Return the response to prevent the response from continuing
        return res.status(400).json({
            status: "error",
            message: `Invalid key(s): ${unexpectedKeys.join(", ")}`
        })
    }

    next()
}   