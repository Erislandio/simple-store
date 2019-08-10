const Category = require('../models/Category')

module.exports = {
    async store(req, res) {
        try {
            const { body: { name } } = req
            const category = await Category.findOne({ name: name.replace(/ /g, "-").toLowerCase() })

            if (category) {
                return res.status(400).send({
                    code: 1,
                    message: "Category already exists!"
                })
            }

            let nameFormated = name.replace(/ /g, "-").toLowerCase();

            const newCAtegory = await Category.create({ ...req.body, name: nameFormated })
            return res.status(201).send(newCAtegory)
        } catch (error) {
            return res.status(500).send(error, { error: true })
        }
    },
    async index(req, res) {
        try {
            const categories = await Category.find()
            return res.status(200).send(categories)
        } catch (error) {
            return res.status(500).send(error, { error: true })
        }

    }
}