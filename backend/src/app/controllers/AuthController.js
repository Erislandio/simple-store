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
            const { body: { email } } = req

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
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

                    token.save(function (err) {
                        if (err) { return res.status(500).send({ msg: err.message }); }

                        let transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: authToken.user, pass: authToken.pass } });
                        let mailOptions = { from: 'no-reply@ebest.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
                        transporter.sendMail(mailOptions, (err) => {
                            if (err) { return res.status(500).send({ msg: err.message }); }
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

        const { body: { token, email } } = req
        try {

            Token.findOne({ token: req.body.token }, (err, token) => {
                if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

                User.findOne({ _id: token._userId, email }, (err, user) => {
                    if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                    if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

                    user.isVerified = true;
                    user.save((err) => {
                        if (err) { return res.status(500).send({ msg: err.message }); }
                        res.status(200).send("The account has been verified. Please log in.");
                    });
                });
            });
        } catch (error) {
            return res.status(500).send(error)
        }
    },
    async resendTokenPost(req, res){
        User.findOne({ email: req.body.email }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
            if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
     
            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
     
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
     
                let transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: authToken.user, pass: authToken.pass } });
                let mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
                transporter.sendMail(mailOptions, (err) => {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send('A verification email has been sent to ' + user.email + '.');
                });
            });
     
        });
    }
};
