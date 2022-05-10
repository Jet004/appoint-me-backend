import { body, header } from 'express-validator';

import checkForUnexpectedKeys from './checkBodyKeys.js';

// Email param validator
export const emailValidator = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .trim()
        .escape(),
]

export const tokenValidator = [
    header('Authorization')
        .exists({ checkFalsy: true }).withMessage("Access token is required")
        .customSanitizer(value => value.replace('Bearer ', ''))
        .isJWT().withMessage("Invalid access token")
        .trim()
        .escape(),
    body('refreshToken')
        .exists({ checkFalsy: true }).withMessage("Refresh token is required")
        .isJWT().withMessage("Invalid refresh token")
        .trim()
        .escape()
]

export const accessTokenValidator = [
    header('Authorization')
        .exists({ checkFalsy: true }).withMessage("Access token is required")
        .customSanitizer(value => value.replace('Bearer ', ''))
        .isJWT().withMessage("Invalid access token")
        .trim()
        .escape()
]

export const ipValidator = [
    body('ip')
        .exists({ checkFalsy: true }).withMessage("IP address is required")
        .isIP().withMessage("Invalid IP address")
        .trim()
        .escape()
]

export const checkAuthKeys = (req, res, next) => {
    let acceptedKeys

    if(req.path === "/logout" || req.path === "/token-refresh") {
        acceptedKeys = [
            "refreshToken"
        ]
    } else if(req.path.split('/')[1] === "login") {
        acceptedKeys = [
            "email",
            "password"
        ]
    }

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

export const isAuthorisedRep = (DbGetCRMByMatch) => async (req, res, next) => {
    // Need to check that the user is authorised to modify the temp user
    // Get CRM for user / business match populating the business and business rep
    const crm = await DbGetCRMByMatch(req.params.businessId, req.params.id)

    // Return error if no CRM found
    if(!crm) return res.status(400).json({ status: "error", message: `No CRM match found for user: ${req.params.id} and business: ${req.params.businessId}` })

    // Populate the business and business rep data from the CRM
    await crm.populate({ path: 'business'})

    // Return error if no business rep information populated
    if(!crm.business.businessRep) return res.status(500).json({ status: "error", message: "An unexpected error occurred" })
    
    // Check that logged in user is the business rep of the business
    if(crm.business.businessRep.toString() !== req.session.user._id.toString()) return res.status(403).json({ status: "error", message: "You are not authorised to modify this user" })

    // Business rep is authorised to modify this temp user. Pass control to the next middleware
    return next()
}

export const verifyRepByBusinessId = (DbGetBusinessByID) => async (req, res, next) => {
    // Get business by business id
    const business = await DbGetBusinessByID(req.params.businessId)

    // Return error if no business found
    if(!business) return res.status(400).json({ status: "error", message: `No business found for business id: ${req.params.businessId}` })

    // Check that logged in user is the business rep of the business
    if(business.businessRep.toString() !== req.session.user._id.toString()) {
        return res.status(403).json({ status: "error", message: "You are not authorised to modify this user" })
    }

    // Business rep is authorised to perform this operation. Pass control to the next middleware
    return next()
}