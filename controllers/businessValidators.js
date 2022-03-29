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