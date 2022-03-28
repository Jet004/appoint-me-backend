import express from "express"
const router = express.Router()

// Import business controllers
import { getBusinessByABN, getBusinessByID, updateBusiness } from "../controllers/businessController"
// Import Business model ODM methods
import { DbGetBusinessByABN, DbGetBusinessByID, DbUpdateBusiness } from "../models/businessRepModel"


// Business routes
router.route("/business/:abn")
    .get(getBusinessByABN(DbGetBusinessByABN))
    .put(updateBusiness(DbUpdateBusiness))

router.route("/business/:id")
    .get(getBusinessByID(DbGetBusinessByID))