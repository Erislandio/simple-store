const User = require("../models/User");
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}


module.exports = {
    async store(req, res) {
        try {
            const {
                body: { email }
            } = req;

            const user = await User.findOne({ email });
            if (user) {
                return res.status(200).send({
                    code: 1,
                    message: "user already exists!"
                });
            }

            const newUser = await User.create(req.body);

            newUser.password = undefined;

            return res.status(201).send({
                newUser,
                token: generateToken({ id: newUser.email })
            });
        } catch (error) {
            return res.status(500).send(error);
        }
    },

    async index(req, res) {
        try {
            const users = await User.find();

            return res.status(200).send(users);
        } catch (error) {
            return res.status(500).send(error);
        }
    }
};
