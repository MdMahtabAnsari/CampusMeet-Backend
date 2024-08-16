const jwt = require('jsonwebtoken');
const serverConfig = require('../configs/serverConfig');

const tokenValidator = (req, res, next) => {
    const token = req.cookies?.otpToken;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access",
            success: false,
            data: {},
            error: "error"
        });
    }
    try {
        const decoded = jwt.verify(token, serverConfig.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized access",
            success: false,
            data: {},
            error: "error"
        });
    }
}


module.exports = {
    tokenValidator
}
