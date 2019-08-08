const User = require("../models/User");

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

            return res.status(201).send(newUser);
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
