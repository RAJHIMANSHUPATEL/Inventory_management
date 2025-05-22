const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const verifyToken = (req, res, next)=> {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token) return res.status(410).json({
        message: "Failure",
        baseResponse: {
            status: 410,
            data: {},
            error: "Access Denied",
        }
    });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        res.status(400).json({
        message: "Failure",
        baseResponse: {
            status: 400,
            data: {},
            error: "Invalid Token",
        }
    })
    }
}

module.exports = verifyToken