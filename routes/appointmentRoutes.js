import express from "express"
const router = express.Router()

// Import controllers
import { userCreateAppointment, updateAppointment, businessRepCreateAppointment, getAppointmentById, deleteAppointment, getAllUserAppointments, getAllBusinessAppointments } from "../controllers/appointmentController"
// Import DB ODM methods
import { DbGetCRMByMatch, DbCreateCRM, DbGetAppointmentsByUserId, DbGetAppointmentsByBusinessId } from "../models/crmModel"
import { DbCreateAppointment, DbGetAppointmentById, DbUpdateAppointment, DbDeleteAppointment } from "../models/appointmentModel"
import { DbGetBusinessByID } from "../models/businessModel"
// Import validators
import { businessIdValidator, idValidator, verifyOwnAccountByAppointmentId } from "../validation/userValidators"
import validationCheck from "../validation/checkValidators"
import { accessTokenValidator, isAuthorisedRep, verifyRepByBusinessId } from "../validation/authValidator"
import { appointmentIdValidator, appointmentValidator, checkAppointmentKeys, checkRepAuthByAppointmentId } from "../validation/appointmentValidator"
import { requireLogin, requireRoles } from "../middleware/sessionHandler"

router.route('/user-appointments')
    .get(
        requireLogin(),
        requireRoles([ "user" ]),
        getAllUserAppointments(DbGetAppointmentsByUserId)
    )

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
    .delete(
        appointmentIdValidator,
        validationCheck,
        requireLogin(),
        requireRoles([ "user" ]),
        verifyOwnAccountByAppointmentId(DbGetAppointmentById),
        deleteAppointment(DbDeleteAppointment)
    )

router.route('/business-rep-appointments/:businessId')
    .get(
        requireLogin(),
        requireRoles([ "businessRep" ]),
        verifyRepByBusinessId(DbGetBusinessByID),
        getAllBusinessAppointments(DbGetAppointmentsByBusinessId)
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
    .delete(
        appointmentIdValidator,
        validationCheck,
        requireLogin(),
        requireRoles([ "businessRep" ]),
        checkRepAuthByAppointmentId(DbGetAppointmentById),
        deleteAppointment(DbDeleteAppointment)
    )

export default router