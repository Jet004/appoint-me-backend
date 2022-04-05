import { body, header } from 'express-validator';

import checkForUnexpectedKeys from './checkBodyKeys';

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