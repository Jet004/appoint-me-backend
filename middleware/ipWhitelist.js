// Import Model methods
import { DbGetUserIPs } from '../models/ipWhitelistModel.js'

export const parseIP = (req) => {
    let requestIP
    if (req.ip.substr(0, 7) == "::ffff:") {
        requestIP = req.ip.substr(7)
    } else {
        requestIP = req.ip
    }
    
    return requestIP
}

export const checkIP = (requestIP, userIPs) => {
    const userIpList = userIPs.map(ip => ip.ip)

    if (userIpList.includes(requestIP)) {
        return true
    }
    return false
}

const ipWhitelist = () => async (req, res, next) => {
    // Check if user is logged in as a businessRep
    if (req.session?.userType !== "businessRep") {
        // User is not a logged in businessRep, pass control to next middleware
        return next()
    }

    // Get user IP from database and request IP from request object
    const userIPs = await DbGetUserIPs(req.session.user._id)
    const requestIP = parseIP(req)

    if(userIPs <= 0 || !requestIP) {
        // One of the required IP addresses is missing， block access
        return res.status(403).json({ status: "error", message: `Access denied: Unauthorized IP address - ${requestIP}` })
    }

    // Check if user IP is whitelisted
    if(!checkIP(requestIP, userIPs)) {
        // User IP is not whitelisted, block access
        return res.status(403).json({ status: "error", message: `Access denied: Unauthorized IP address - ${requestIP}` })
    }

    // User IP is whitelisted, pass control to next middleware
    next()
}

export default ipWhitelist