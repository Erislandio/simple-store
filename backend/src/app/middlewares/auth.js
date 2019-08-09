const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).send({
            code: 4,
            message: "Empty token"
        })
    }

    const parts = authHeader.split(' ')

    if (!parts.length === 2) {
        return res.status(401).send({
            code: 5,
            message: "incomplete token"
        })
    }

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({
            code: 6,
            message: "Token without Bearer"
        })
    }

    jwt.verify(token, authConfig.secret, (err, decode) => {
        if (err) {
            return res.status(401).send({
                code: 7,
                message: "invalid token"
            })
        }

        req.userId = decode.id
        return next()
    })


}