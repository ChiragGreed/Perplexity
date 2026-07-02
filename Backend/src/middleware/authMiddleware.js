import JWT from 'jsonwebtoken'

const verifyUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) return res.status(404).json({
        message: "Token not found",
        success: false,
        err: "No token found"
    })

    try {
        const decodedToken = JWT.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;
        next();

    } catch (err) {
        res.status(400).json({
            message: "Invalid or expired token",
            success: falses,
            err: "Invalid or expired token"
        })
    }


}


export default verifyUser
