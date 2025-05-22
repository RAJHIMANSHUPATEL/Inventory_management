const Category = require("../models/category.model");

// add a category
const addCategory = async (req, res) => {
    try {
        const { name, description, imageUrl, isActive } = req.body;
        if (!name || !isActive) {
            res.status(201).json({
                status: 0,
                data: null,
                error: "Please fill the required fields"
            })
        }
        const category = await Category.create({ name, description, imageUrl, isActive });

        res.status(201).json({
            status: 1,
            data: category,
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

// getAllCategories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        if (!categories) {
            return res.status(400).json({
                status: 0,
                data: null,
                error: "No categories found"
            })
        }
        return res.status(200).json({
            status: 1,
            data: categories,
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

// Update category
const updateCategory = async (req, res) => {

}

module.exports = {
    addCategory,
    getAllCategories,
    updateCategory
}