const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
    const token = req.cookies?.authToken;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access",
            success: false,
            data: {},
            error: "error"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
    isLoggedIn
}