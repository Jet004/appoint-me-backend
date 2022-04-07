import express from "express"
const router = express.Router()

// Import business controllers
import { createBusinessService, deleteBusinessService, getBusinessByABN, getBusinessByID, getBusinessServiceById, getBusinessServices, updateBusiness, updateBusinessService } from "../controllers/businessController"
import { requireLogin, requireRoles, isAuthorised } from "../middleware/sessionHandler"
// Import Business model ODM methods
import { DbCreateBusinessService, DbDeleteBusinessService, DbGetBusinessByABN, DbGetBusinessByID, DbGetBusinessServiceById, DbUpdateBusiness, DbUpdateBusinessService } from "../models/businessModel"
// Import validators
import { accessTokenValidator } from "../validation/authValidator"
import { idValidator, abnValidator, businessValidator, checkKeys, serviceValidator, serviceIdValidator } from "../validation/businessValidators"
import validationCheck  from "../validation/checkValidators"

// Business routes
// Get/Create services by business ABN
router.route('/services/:abn')
    .get(
        abnValidator, 
        validationCheck, 
        getBusinessServices(DbGetBusinessByABN)
    )
    .post(
        accessTokenValidator, 
        abnValidator, 
        serviceValidator, 
        validationCheck, 
        checkKeys, 
        requireLogin(), 
        requireRoles(['businessRep']),
        isAuthorised(),
        createBusinessService(DbGetBusinessByABN, DbCreateBusinessService)
    )

// Get/update service by ID for business with given ABN
router.route('/services/:abn/:serviceId')
    .get(
        abnValidator, 
        serviceIdValidator, 
        validationCheck, 
        getBusinessServiceById(DbGetBusinessServiceById)
    )
    .put(
        abnValidator,
        serviceIdValidator,
        serviceValidator,
        validationCheck,
        checkKeys,
        requireLogin(),
        requireRoles(['businessRep']),
        isAuthorised(),
        updateBusinessService(DbUpdateBusinessService)
    )
    .delete(
        abnValidator,
        serviceIdValidator,
        validationCheck,
        requireLogin(),
        requireRoles(['businessRep']),
        isAuthorised(),
        deleteBusinessService(DbDeleteBusinessService)
    )

// Get/Update business by ABN
router.route('/:abn')
    .get(
        abnValidator, 
        validationCheck, 
        getBusinessByABN(DbGetBusinessByABN)
    )
    .put(
        accessTokenValidator, 
        abnValidator, 
        businessValidator, 
        validationCheck,
        checkKeys, 
        requireLogin(), 
        requireRoles(['businessRep']),
        isAuthorised(),
        updateBusiness(DbUpdateBusiness)
    )

// Get business by ID
router.route("/id/:id")
    .get(idValidator, validationCheck, getBusinessByID(DbGetBusinessByID))

export default router