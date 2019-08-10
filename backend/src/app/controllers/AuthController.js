const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')
const nodemailer = require('nodemailer')
const { validateEmail } = require('../../helpers/validadeEmail')
const Token = require('../models/Token')
const crypto = require('crypto')
const authToken = require('../../config/env.json')

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
            const { body: { email, name, lastname } } = req

            if (!validateEmail(email)) {
                return res.send({
                    message: "Invalid email",
                    code: 3
                })
            }

            User.findOne({ email }, (err, user) => {

                if (user) return res.status(400).send({
                    code: 3,
                    message: 'The email address you have entered is already associated with another account.'
                }
                );

                user = new User(req.body);

                user.save((err) => {
                    if (err) { return res.status(500).send({ message: err.message }); }
                    const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

                    token.save(function (err) {
                        if (err) { return res.status(500).send({ message: err.message }); }

                        let transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: authToken.user, pass: authToken.pass } });
                        let mailOptions = { from: 'no-reply@ebest.com', to: user.email, subject: 'Account Verification Token', text: `Hello ${name} ${lastname}. <br /> You code is: ${token.token}` };
                        transporter.sendMail(mailOptions, (err) => {
                            if (err) { return res.status(500).send({ message: err.message }); }
                            res.status(200).send({
                                code: 200,
                                message: `A verification email has been sent to ${user.email}`
                            });
                        });
                    });
                });
            });


        } catch (error) {
            return res.status(500).send(error);
        }
    },
    async loginConfirmation(req, res) {
        const { body: { token: tokenUser } } = req
        try {
            Token.findOne({ token: tokenUser }, (err, token) => {
                if (!token) return res.status(400).send({ type: 'not-verified', message: 'We were unable to find a valid token. Your token my have expired.' });

                User.findOne({ _id: token._userId }, (err, user) => {
                    if (!user) return res.status(400).send({ message: 'We were unable to find a user for this token.' });
                    if (user.isVerified) return res.status(400).send({ type: 'already-verified', message: 'This user has already been verified.' });

                    user.isVerified = true;
                    user.password = undefined
                    user.save((err) => {
                        if (err) { return res.status(500).send({ message: err.message }); }
                        res.status(200).send({
                            code: 200,
                            message: `The account has been verified. Please log in.`,
                            user
                        });
                    });
                });
            });
        } catch (error) {
            return res.status(500).send(error)
        }
    },
    async resendTokenPost(req, res) {
        try {
            const { body: { email } } = req
            User.findOne({ email }, (err, user) => {
                if (!user) return res.status(400).send({ message: 'We were unable to find a user with that email.', code: 1 });
                if (user.isVerified) return res.status(200).send({ message: 'This account has already been verified. Please log in.' });

                const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

                token.save((err) => {
                    if (err) { return res.status(500).send({ message: err.message }); }

                    let transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: authToken.user, pass: authToken.pass } });
                    let mailOptions = { from: 'no-reply@ebest.io', to: user.email, subject: 'Account Verification Token', text: `Hello ${name} ${lastname}. \n You code is: ${token.token}` };
                    transporter.sendMail(mailOptions, (err) => {
                        if (err) { return res.status(500).send({ message: err.message }); }
                        res.status(200).send({
                            code: 200,
                            message: `A verification email has been sent to ${user.email}.`
                        });
                    });
                });
            });

        } catch (error) {
            return res.status(500).send(error)
        }
    }
};
