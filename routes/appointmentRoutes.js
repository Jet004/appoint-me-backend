import express from "express"
const router = express.Router()

// Import controllers
import { userCreateAppointment, updateAppointment, businessRepCreateAppointment, getAppointmentById } from "../controllers/appointmentController"
// Import DB ODM methods
import { DbGetCRMByMatch, DbCreateCRM } from "../models/crmModel"
import { DbCreateAppointment, DbGetAppointmentById, DbUpdateAppointment } from "../models/appointmentModel"
import { businessIdValidator, idValidator, verifyOwnAccountByAppointmentId } from "../validation/userValidators"
import validationCheck from "../validation/checkValidators"
import { accessTokenValidator, isAuthorisedRep } from "../validation/authValidator"
import { appointmentIdValidator, appointmentValidator, checkAppointmentKeys, checkRepAuthByAppointmentId } from "../validation/appointmentValidator"
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

router.route('/user/crud/:appointmentId')
    .get(
        appointmentIdValidator,
        validationCheck,
        requireLogin(),
        requireRoles([ "user" ]),
        verifyOwnAccountByAppointmentId(DbGetAppointmentById),
        getAppointmentById(DbGetAppointmentById)
    )
    .put(
        appointmentIdValidator,
        appointmentValidator,
        validationCheck,
        requireLogin(),
        requireRoles([ "user" ]),
        verifyOwnAccountByAppointmentId(DbGetAppointmentById),
        updateAppointment(DbUpdateAppointment)
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

router.route('/business-rep/crud/:appointmentId')
    .get(
        appointmentIdValidator,
        validationCheck,
        requireLogin(),
        requireRoles([ "businessRep" ]),
        checkRepAuthByAppointmentId(DbGetAppointmentById),
        getAppointmentById(DbGetAppointmentById)
    )
    .put(
        appointmentIdValidator,
        appointmentValidator,
        validationCheck,
        requireLogin(),
        requireRoles([ "businessRep" ]),
        checkRepAuthByAppointmentId(DbGetAppointmentById),
        updateAppointment(DbUpdateAppointment)
    )

export default router