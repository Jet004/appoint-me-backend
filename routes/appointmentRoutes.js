import express from "express"
const router = express.Router()

// Import controllers
import { userCreateAppointment, updateAppointment, businessRepCreateAppointment } from "../controllers/appointmentController"
// Import DB ODM methods
import { DbGetCRMByMatch, DbCreateCRM } from "../models/crmModel"
import { DbCreateAppointment, DbUpdateAppointment } from "../models/appointmentModel"
import { businessIdValidator, idValidator, isOwnAccount } from "../validation/userValidators"
import validationCheck from "../validation/checkValidators"
import { accessTokenValidator, isAuthorisedRep } from "../validation/authValidator"
import { appointmentValidator, checkAppointmentKeys } from "../validation/appointmentValidator"
import { requireLogin, requireRoles } from "../middleware/sessionHandler"

router.route('/user/:businessId')
    .post(
        businessIdValidator,
        accessTokenValidator,
        appointmentValidator,
        validationCheck,
        checkAppointmentKeys(),
        requireLogin(),
        requireRoles([ "user" ]),
        userCreateAppointment(DbGetCRMByMatch, DbCreateCRM, DbCreateAppointment)
    )

router.route('/business-rep/:businessId/:id')
    .post(
        businessIdValidator,
        idValidator,
        appointmentValidator,
        validationCheck,
        requireLogin(),
        requireRoles([ "businessRep" ]),
        isAuthorisedRep(DbGetCRMByMatch),
        businessRepCreateAppointment(DbGetCRMByMatch, DbCreateAppointment)
    )

router.route('/update/:appointmentId')
    .put(
        (req, res, next) => {
            // User access checks different for user and businessRep
            return next()
        },
        updateAppointment(DbGetCRMByMatch, DbUpdateAppointment)
    )

export default router