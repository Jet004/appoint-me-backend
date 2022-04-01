import { validationResult } from 'express-validator'

// Check for validation errors and respond if there are any
const validationCheck = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

export default validationCheck