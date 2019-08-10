const Brand = require('../models/Brand')

module.exports = {
    async store(req, res) {

        try {

            const { body: { name } } = req
            const { originalname: nameFile, size, key, location: url = "" } = req.file;

            const brand = await Brand.findOne({ name: name.toLowerCase() })

            if (brand) {

                return res.status(400).send({
                    code: 1,
                    message: "Brand already exists!"
                })

            }

            let nameFormated = name.replace(/ /g, "-").toLowerCase();

            const newBrand = await Brand.create({
                ...req.body, name: nameFormated, image: {
                    name: nameFile,
                    size,
                    key,
                    url
                }
            })
            return res.status(201).send(newBrand)

        } catch (error) {
            return res.status(500).send(error)
        }

    }
}