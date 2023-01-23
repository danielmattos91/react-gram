const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtsecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    //checar se o header tem o token
    if(!token) return res.status(401).json({errors: ["Acesso negado!"]});

    try {

        const verified = jwt.verify(token, jwtsecret);

        req.user = await User.findById(verified.id).select("-password");

        next();
    } catch (error) {
        res.status(401).jason({errors: ["Token invalido."]})
    }
};

module.exports = authGuard;