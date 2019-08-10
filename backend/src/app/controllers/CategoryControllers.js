const Category = require('../models/Category')

module.exports = {
    async store(req, res) {

        try {

            const { body: { name } } = req
            const category = await Category.findOne({ name: name.toLowerCase() })

            if (category) {

                return res.status(400).send({
                    code: 1,
                    message: "Category already exists!"
                })

            }

            const newCAtegory = await Category.create(req.body) 
            return res.status(201).send(newCAtegory)

        } catch (error) {
            return res.status(500).send(error)
        }

    }
}