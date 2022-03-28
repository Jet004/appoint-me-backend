import express from "express"
const router = express.Router()

// Import business controllers
import { getBusinessByABN, getBusinessByID, updateBusiness } from "../controllers/businessController"
// Import Business model ODM methods
import { DbGetBusinessByABN, DbGetBusinessByID, DbUpdateBusiness } from "../models/businessModel"


// Business routes
router.route("/:abn")
    .get(getBusinessByABN(DbGetBusinessByABN))
    .put(updateBusiness(DbUpdateBusiness))

router.route("/id/:id")
    .get(getBusinessByID(DbGetBusinessByID))


export default router