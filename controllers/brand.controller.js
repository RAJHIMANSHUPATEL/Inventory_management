const Brand = require("../models/brand.model");

// add a category
const addBrand = async () => {
    try {
        const { name, logoUrl, isActive } = req.body;
        if (!name || !isActive) {
            res.status(201).json({
                status: 0,
                data: null,
                error: "Please fill the required fields."
            })
        }
        const brand = await Brand.create({ name, logoUrl, isActive });

        res.status(201).json({
            status: 1,
            data: brand,
            error: null
        })
    } catch (error) {
        res.status(400).json({
            status: 0,
            data: null,
            error: error.message
        })
    }
}

const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();

        if (!brands) {
            return res.status(400).json({
                status: 0,
                data: null,
                error: "No brands found"
            })
        }
        return res.status(200).json({
            status: 1,
            data: brands,
            error: null
        })
    } catch (error) {
        return res.status(400).json({
            status: 0,
            data: null,
            error: error.message
        })
    }
}

module.exports = {
    addBrand,
    getAllBrands
}