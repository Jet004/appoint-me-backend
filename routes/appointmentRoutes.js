import express from "express"
const router = express.Router()

// Import controllers
import { userCreateAppointment, updateAppointment, businessRepCreateAppointment, getAppointmentById, deleteAppointment, getAllUserAppointments, getAllBusinessAppointments, getAvailableAppointmentTimes } from "../controllers/appointmentController.js"
// Import DB ODM methods
import { DbGetCRMByMatch, DbCreateCRM, DbGetAppointmentsByUserId, DbGetAppointmentsByBusinessId } from "../models/crmModel.js"
import { DbCreateAppointment, DbGetAppointmentById, DbUpdateAppointment, DbDeleteAppointment, DbGetAppointmentByBusinessDate } from "../models/appointmentModel.js"
import { DbGetBusinessByID } from "../models/businessModel.js"
// Import validators
import { businessIdValidator, idValidator, verifyOwnAccountByAppointmentId } from "../validation/userValidators.js"
import validationCheck from "../validation/checkValidators.js"
import { accessTokenValidator, isAuthorisedRep, verifyRepByBusinessId } from "../validation/authValidator.js"
import { appointmentIdValidator, appointmentValidator, checkAppointmentKeys, checkRepAuthByAppointmentId } from "../validation/appointmentValidator.js"
import { requireLogin, requireRoles } from "../middleware/sessionHandler.js"
import { serviceIdValidator } from "../validation/businessValidators.js"

router.route('/appointment-times/:businessId/:serviceId/:date')
    .get(
        businessIdValidator,
        serviceIdValidator,
        validationCheck,
        getAvailableAppointmentTimes(DbGetBusinessByID, DbGetAppointmentByBusinessDate)
    )

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