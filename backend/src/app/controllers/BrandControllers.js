const Brand = require('../models/Brand')

module.exports = {
    async store(req, res) {
        try {
            const { body: { name } } = req

            if (req.file) {
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
            }

            let nameFormated = name.replace(/ /g, "-").toLowerCase();
            const newBrand = await Brand.create({
                ...req.body, name: nameFormated
            })
            return res.status(201).send(newBrand)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    },
    async index(req, res) {
        try {

            const brands = await Brand.find()

            return res.status(200).send(brands)
        } catch (error) {
            return res.status(500).send(error)
        }
    }
}