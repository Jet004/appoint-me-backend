import express from "express"
const router = express.Router()

// Import business controllers
import { createBusinessService, getBusinessByABN, getBusinessByID, getBusinessServiceById, getBusinessServices, updateBusiness } from "../controllers/businessController"
import { requireLogin, requireRoles } from "../middleware/sessionHandler"
// Import Business model ODM methods
import { DbCreateBusinessService, DbGetBusinessByABN, DbGetBusinessByID, DbGetBusinessServiceById, DbUpdateBusiness } from "../models/businessModel"
// Import validators
import { accessTokenValidator } from "../validation/authValidator"
import { idValidator, abnValidator, businessValidator, checkKeys, serviceValidator } from "../validation/businessValidators"
import validationCheck  from "../validation/checkValidators"

// Business routes
// Get/Create service by business ABN
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
        createBusinessService(DbGetBusinessByABN, DbCreateBusinessService)
    )

// Get service by ID for business with given ABN
router.route('/services/:abn/:serviceId')
    .get(getBusinessServiceById(DbGetBusinessServiceById))

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
        updateBusiness(DbUpdateBusiness)
    )

// Get business by ID
router.route("/id/:id")
    .get(idValidator, validationCheck, getBusinessByID(DbGetBusinessByID))

export default router