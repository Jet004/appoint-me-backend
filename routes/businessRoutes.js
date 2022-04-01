import express from "express"
const router = express.Router()

// Import business controllers
import { createBusinessService, getBusinessByABN, getBusinessByID, getBusinessServiceById, getBusinessServices, updateBusiness } from "../controllers/businessController"
// Import Business model ODM methods
import { DbCreateBusinessService, DbGetBusinessByABN, DbGetBusinessByID, DbGetBusinessServiceById, DbUpdateBusiness } from "../models/businessModel"
// Import validators
import { idValidator, abnValidator, businessValidator, checkKeys, serviceValidator } from "../validation/businessValidators"
import validationCheck  from "../validation/checkValidators"

// Business routes
router.route('/services/:abn')
    .get(abnValidator, validationCheck, getBusinessServices(DbGetBusinessByABN))
    .post(abnValidator, serviceValidator, validationCheck, createBusinessService(DbGetBusinessByABN, DbCreateBusinessService))

router.route('/services/:abn/:serviceId')
    .get(getBusinessServiceById(DbGetBusinessServiceById))

router.route('/:abn')
    .get(abnValidator, validationCheck, getBusinessByABN(DbGetBusinessByABN))
    .put(abnValidator, businessValidator, validationCheck, checkKeys, updateBusiness(DbUpdateBusiness))

router.route("/id/:id")
    .get(idValidator, validationCheck, getBusinessByID(DbGetBusinessByID))

export default router