const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')
const nodeMailer = require('nodemailer')
const { validateEmail } = require('../../helpers/validadeEmail')

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

module.exports = {
    async authenticate(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email }).select("+password");

            if (!user) {
                return res.status(404).send({
                    code: 2,
                    message: "User is not registered!"
                });
            }

            if (!(await bcrypt.compare(password, user.password))) {
                return res.status(400).send({
                    code: 3,
                    message: "Incorrect Password"
                });
            }

            user.password = undefined;

            return res.status(200).send({
                user,
                token: generateToken({ id: user.email })
            });
        } catch (error) {
            return res.status(500).send(error);
        }
    },
    async login(req, res) {

        try {
            const { body: { email } } = req

            if (!validateEmail(email)) {
                return res.send({
                    message: "Invalid email",
                    code: 3
                })
            }

            return res.status(200).send(email)



        } catch (error) {
            return res.status(500).send(error);

        }

    }
};
