const User = require("../models/User");
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')


function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

module.exports = {
    async store(req, res) {
        try {
            const {
                body: { email, name, lastname, document, password, admin }
            } = req;
            const { originalname: nameFile, size, key, location: url = "" } = req.file;

            const user = await User.findOne({ email });
            if (user) {
                return res.status(200).send({
                    code: 1,
                    message: "user already exists!"
                });
            }

            const newUser = await User.create({
                image: {
                    name: nameFile,
                    size,
                    key,
                    url
                },
                name,
                lastname,
                document,
                password,
                admin,
                email
            });

            newUser.password = undefined;

            return res.status(201).send({
                newUser,
                token: generateToken({ id: newUser.email })
            });
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);

        }
    },

    async index(req, res) {
        try {
            const users = await User.find().select('-password')
            return res.status(200).send(users);
        } catch (error) {
            return res.status(500).send(error);
        }
    },
    async getUserByEmail(req, res) {
        try {

            const { body: { email } } = req

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).send({
                    code: 2,
                    message: "User not exists"
                })
            }

            user.password = undefined

            return res.status(200).send(user)

        } catch (error) {
            return res.status(500).send(error);
        }
    },
    async update(req, res) {

        try {

            const { body: { email } } = req
            const { originalname: nameFile, size, key, location: url = "" } = req.file;

            const update = await User.findOneAndUpdate(email, {
                $set: req.body, $set: {
                    image: {
                        name: nameFile,
                        size,
                        key,
                        url
                    }
                }
            }).select('-password')

            return res.status(201).send(update)

        } catch (error) {
            return res.status(500).send(error);
        }

    },
    async delete(req, res) {
        try {

            const { body: { email } } = req
            const removed = await User.findOneAndDelete({ email }).select()

            removed.password = undefined

            return res.status(201).send({
                removed
            })


        } catch (error) {
            return res.status(500).send(error);

        }
    }

};
