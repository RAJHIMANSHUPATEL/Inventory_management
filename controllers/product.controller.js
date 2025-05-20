const Product = require("../models/product.model");

const addProduct = async(req, res)=> {
    const {name, sku, description, category, price, quantity, lowStockAlert} = req.body;

    if(!name || !sku || !category || !price || !quantity ){
        return res.status(400).json({
            status: 0,
            message: "Validation error",
            data: null,
            error: "All fields are required"
        });
    }

    const newProduct = await Product.create({
        name, sku, description, category, price, quantity, lowStockAlert
    })
    res.status(201).json({
        status: 1,
        message: "Product uploaded successfully",
        data: newProduct,
        error: null,
    })
}

module.exports = {
    addProduct,
}