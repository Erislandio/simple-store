const User = require("../models/User");

module.exports = {
    async store(req, res) {
        console.log(req.body);

        return req.body;
    }
};
