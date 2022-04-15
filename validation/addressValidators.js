import { body } from "express-validator"

// Validate required address fields
export const validateAddressRequired = [
    body('address.unit')
        .optional({checkFalsy: true})
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
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('Country must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 100}).withMessage('Country must be between 2 and 100 characters')
        .trim()
        .escape(),
]

export const validateAddressOptional = [
    // Validate address fields
    body('address.unit')
        .optional({checkFalsy: true})
        .isNumeric({no_symbols: true}).withMessage('Unit number must be numeric')
        .isLength({min: 1, max: 6}).withMessage('Unit number must be between 1 and 6 digits long')
        .trim()
        .escape(),
    body('address.streetNumber')
        .optional({checkFalsy: true})
        .isNumeric({no_symbols: true}).withMessage('Street number must be numeric')
        .isLength({min: 1, max: 6}).withMessage('Street number must be between 1 and 6 digits long')
        .trim()
        .escape(),
    body('address.streetName')
        .optional({checkFalsy: true})
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('Street name must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 100}).withMessage('Street name must be between 2 and 100 characters')
        .trim()
        .escape(),
    body('address.city')
        .optional({checkFalsy: true})
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('City must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 100}).withMessage('City must be between 2 and 100 characters')
        .trim()
        .escape(),
    body('address.state')
        .optional({checkFalsy: true})
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('State must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 100}).withMessage('State must be between 2 and 100 characters')
        .trim()
        .escape(),
    body('address.postCode')
        .optional({checkFalsy: true})
        .isNumeric({no_symbols: true}).withMessage('Postcode must be numeric')
        .isLength({min: 4, max: 4}).withMessage('Postcode must be 4 digits long')
        .trim()
        .escape(),
    body('address.country')
        .optional({checkFalsy: true})
        .isAlpha('en-AU', {ignore: "'. -"}).withMessage('Country must be letters, spaces, hyphens, apostrophes, or periods')
        .isLength({min: 2, max: 100}).withMessage('Country must be between 2 and 100 characters')
        .trim()
        .escape(),
]