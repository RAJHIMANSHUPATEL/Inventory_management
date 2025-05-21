const Product = require("../models/product.model");

// Add new product
const addProduct = async (req, res) => {
    const { name, sku, description, category, price, quantity, lowStockAlert, supplier, purchaseDate } = req.body;

    if (!name || !sku || !category || !price || !quantity || !supplier || !purchaseDate) {
        return res.status(400).json({
            status: 0,
            data: [],
            error: "All fields are required"
        });
    }

    // Check if the SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
        return res.status(400).json({
            status: 0,
            data: [],
            error: "SKU already exists"
        });
    }

    const newProduct = await Product.create({
        name, sku, description, category, price, quantity, lowStockAlert, supplier, purchaseDate
    });
    res.status(201).json({
        status: 1,
        data: newProduct,
        error: null,
    });
}

// get all produts
const getProducts = async (req, res)=> {
    try {
        const products = await Product.find();
        res.status(200).json({
            status: 1,
            data: products,
            error: null
        })
    } catch (error) {
        res.status(400).json({
            status: 0,
            data: [],
            error: "An error occurred."
        })
    }
}

// cosnt getProductBySku

const getProductBySku = async (req, res)=> {
    const {sku} = req.body;
    try {
        if(!sku){
            return res.status(400).json({
                status: 0,
                data: [],
                error: "Please provide a sku"
            })
        }

        const product = await Product.findOne({sku});
        if(!product){
            return res.status(400).json({
                status: 0,
                data: [],
                error: "Invalid SKU!"
            })
        }

        res.status(200).json({
            status: 1,
            data: product,
            error: null
        })
    } catch (error) {
        res.status(400).json({
            status: 0,
            data: [],
            error: "An Error Occurred"
        })
    }
}


// Update product quantity
const updateProductQuantity = async (req, res) => {
    const { sku, quantityChange, action } = req.body;

    // Validate if both sku and quantityChange are provided
    if (!sku || !quantityChange || !action) {
        return res.status(400).json({
            status: 0,
            data: [],
            error: "All fields are required"
        });
    }


    // Validate if quantityChange is a valid number
    // if (isNaN(quantityChange)) {
    //     return res.status(400).json({
    //         status: 0,
    //         data: null,
    //         error: "Quantity change must be a number"
    //     });
    // }

    try {
        const product = await Product.findOne({ sku });

        if (!product) {
            return res.status(404).json({
                status: 0,
                data: [],
                error: "Invalid SKU!"
            });
        }
        if (action !== "restock" && action !== "ship") {
            return res.status(400).json({
                status: 0,
                data: [],
                error: "Invalid Action"
            })
        }

        var newQuantity;

        if (action === "restock") {
            newQuantity = product.quantity + parseInt(quantityChange);
        }

        if (action === "ship") {
            newQuantity = product.quantity - parseInt(quantityChange);
        }

        // You can further handle saving the newQuantity and updating the product.


        if (newQuantity < 0) {
            return res.status(400).json({
                status: 0,
                data: [],
                error: "Insufficient stock!"
            });
        }

        product.quantity = newQuantity;
        const updatedProduct = await product.save();

         res.status(200).json({
            status: 1,
            data: updatedProduct,
            error: null
        });

    } catch (error) {
        console.error(error);
         res.status(500).json({
            status: 0,
            data: [],
            error: "Server error"
        });
    }
};

module.exports = {
    addProduct,
    updateProductQuantity,
    getProducts,
    getProductBySku
}
