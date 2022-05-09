import { body, param } from 'express-validator'

export const appointmentValidator = [
    // No need to validate the CRM id here as it will be automatically inserted in the controller
    body('service')
        .exists({ checkFalsy: true }).withMessage('Service is required')
        .isMongoId().withMessage('Service must be a valid Mongo ID')
        .isLength({ min: 1, max: 40 }).withMessage('Service must be between 1 and 40 characters')
        .trim()
        .escape(),
    body('appointmentTime')
        .exists({ checkFalsy: true }).withMessage('Appointment Time is required')
        .isISO8601().withMessage('Appointment Time must be a valid ISO 8601 date')
        .isLength({ min: 1, max: 40 }).withMessage('Appointment Time must be between 1 and 40 characters')
        .trim()
        .escape(),
    body('appointmentEnd')
        .exists({ checkFalsy: true }).withMessage('Appointment End is required')
        .isISO8601().withMessage('Appointment End must be a valid ISO 8601 date')
        .isLength({ min: 1, max: 40 }).withMessage('Appointment End must be between 1 and 40 characters')
        .trim()
        .escape(),
    body('fee')
        .exists({ checkFalsy: true }).withMessage('Fee is required')
        .isNumeric({ no_symbols: false }).withMessage('Fee can only contain Numbers')
        .isLength({ min: 0, max: 10000000 }).withMessage('Fee must be between 0 and 1000000')
        .trim()
        .escape(),
    body('feeDue')
        .exists({ checkFalsy: true }).withMessage('Fee Due is required')
        .isISO8601().withMessage('Fee Due must be a valid ISO 8601 date')
        .isLength({ min: 1, max: 40 }).withMessage('Fee Due must be between 1 and 40 characters')
        .trim()
        .escape(),
    body('paymentStatus')
        .exists({ checkFalsy: true }).withMessage('Payment Status is required')
        .isIn(['paid', 'unpaid', 'partially paid']).withMessage('Payment Status must be one of paid, unpaid or partially paid')
        .isLength({ min: 1, max: 40 }).withMessage('Payment Status must be between 1 and 40 characters')
        .trim()
        .escape(),
    body('details')
        .optional({ checkFalsy: true })
        .isLength({ min: 0, max: 3000 }).withMessage('Details must be between 0 and 1000 characters')
        .trim()
        .escape(),
]

export const crmIdValidator = [
    body('crm')
        .exists({ checkFalsy: true }).withMessage('CRM is required')
        .isMongoId().withMessage('CRM must be a valid Mongo ID')
        .isLength({ min: 1, max: 40 }).withMessage('CRM must be between 1 and 40 characters')
        .trim()
        .escape(),
]

export const appointmentIdValidator = [
    param('appointmentId')
        .exists({ checkFalsy: true }).withMessage('Appointment ID is required')
        .isMongoId().withMessage('Appointment ID must be a valid Mongo ID')
        .isLength({ min: 1, max: 40 }).withMessage('Appointment ID must be between 1 and 40 characters')
        .trim()
        .escape()
]

export const checkAppointmentKeys = () => (req, res, next) => {
    let acceptedKeys
    
    if (req.path.split('/')[1] === 'appointments') {
        acceptedKeys = [
            "_id",
            "crm",
            "service",
            "appointmentTime",
            "appointmentEnd",
            "fee",
            "feeDue",
            "paymentStatus",
            "details",
        ]
    }
    if (req.path.split('/')[1] === 'appointments') {
        const keys = Object.keys(req.body)
        const diff = keys.filter(key => !acceptedKeys.includes(key))
        if (diff.length > 0) {
            return res.status(400).json({
                message: `The following keys are not allowed: ${diff.join(', ')}`,
            })
        }
    }
    next()
}

export const checkRepAuthByAppointmentId = (DbGetAppointmentById) => async (req, res, next) => {
    // Get appointment from DB
    const appointment = await DbGetAppointmentById(req.params.appointmentId)
    if (!appointment) {
        return res.status(404).json({
            message: `Appointment with ID ${req.params.appointmentId} not found`,
        })
    }
    
    // Check if the logged in user is an authorized rep of the business
    // Populate the CRM and business
    await appointment.populate({path: 'crm', populate: {path: 'business'}})
    if(appointment.crm.business.businessRep.toString() !== req.session.user._id.toString()) {
        // The user is not authorized to edit this appointment
        return res.status(403).json({ status: "Forbidden", message: "You are not authorized to edit this appointment" })
    }

    // User is authorized to edit this appointment. Pass control to the next middleware
    next()
}