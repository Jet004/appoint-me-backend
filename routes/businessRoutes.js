import express from "express"
const router = express.Router()

// Import business controllers
import { createBusinessService, deleteBusinessService, getBusinessByID, getBusinessServiceById, getBusinessServices, updateBusiness, updateBusinessService, getClientList, getIpList, addIP, deleteIP } from "../controllers/businessController.js"
import { requireLogin, requireRoles, isAuthorised } from "../middleware/sessionHandler.js"
// Import Business model ODM methods
import { DbCreateBusinessService, DbDeleteBusinessService, DbGetBusinessByID, DbGetBusinessServiceById, DbUpdateBusiness, DbUpdateBusinessService } from "../models/businessModel.js"
import { DbGetClientList } from "../models/crmModel.js"
import { DbGetUserIPs, DbRegisterIP, DbDeleteIP } from "../models/ipWhitelistModel.js"
// Import validators
import { accessTokenValidator, verifyRepByBusinessId, ipValidator } from "../validation/authValidator.js"
import { idValidator, abnValidator, businessValidator, checkKeys, serviceValidator, serviceIdValidator } from "../validation/businessValidators.js"
import validationCheck  from "../validation/checkValidators.js"
import { businessIdValidator } from "../validation/userValidators.js"

// Business routes
// Get/Create services by businessId
router.route('/services/:businessId')
    .get(
        businessIdValidator, 
        validationCheck, 
        getBusinessServices(DbGetBusinessByID)
    )
    .post(
        accessTokenValidator, 
        businessIdValidator, 
        serviceValidator, 
        validationCheck, 
        checkKeys, 
        requireLogin(), 
        requireRoles(['businessRep']),
        isAuthorised(),
        createBusinessService(DbGetBusinessByID, DbCreateBusinessService)
    )

// Get/update service by ID for business with given ID
router.route('/services/:businessId/:serviceId')
    .get(
        businessIdValidator, 
        serviceIdValidator, 
        validationCheck, 
        getBusinessServiceById(DbGetBusinessServiceById)
    )
    .put(
        businessIdValidator,
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
        businessIdValidator,
        serviceIdValidator,
        validationCheck,
        requireLogin(),
        requireRoles(['businessRep']),
        isAuthorised(),
        deleteBusinessService(DbDeleteBusinessService)
    )

// Get/Update business by ID
router.route('/:businessId')
    .get(
        businessIdValidator, 
        validationCheck, 
        getBusinessByID(DbGetBusinessByID)
    )
    .put(
        accessTokenValidator, 
        businessIdValidator, 
        businessValidator, 
        validationCheck,
        checkKeys, 
        requireLogin(), 
        requireRoles(['businessRep']),
        isAuthorised(),
        updateBusiness(DbUpdateBusiness)
    )

router.route("/client-list/:businessId")
    .get(
        businessIdValidator,
        validationCheck,
        requireLogin(),
        requireRoles(['businessRep']),
        verifyRepByBusinessId(DbGetBusinessByID),
        getClientList(DbGetClientList)
    )

router.route("/admin/access/ip/:businessId")
    .get(
        businessIdValidator,
        validationCheck,
        requireLogin(),
        requireRoles(['businessRep']),
        verifyRepByBusinessId(DbGetBusinessByID),
        getIpList(DbGetUserIPs)
    )
    .post(
        businessIdValidator,
        ipValidator,
        validationCheck,
        requireLogin(),
        requireRoles(['businessRep']),
        verifyRepByBusinessId(DbGetBusinessByID),
        addIP(DbGetUserIPs, DbRegisterIP)
    )
    .delete(
        businessIdValidator,
        ipValidator,
        validationCheck,
        requireLogin(),
        requireRoles(['businessRep']),
        verifyRepByBusinessId(DbGetBusinessByID),
        deleteIP(DbDeleteIP)
    )

export default router