const authConfig = require("../config/auth.json");
const jwt = require("jsonwebtoken");

module.exports = generateToken = (params = {}) => {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
};
