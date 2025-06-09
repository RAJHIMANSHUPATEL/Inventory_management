const Product = require("../models/product.model");

// Add new product
const addProduct = async (req, res) => {
    const { name, sku, description, category, brand, price, quantity, lowStockAlert, supplier, purchaseDate } = req.body;

    if (!name || !sku || !category || !brand || !price || !quantity || !supplier || !purchaseDate) {
        return res.status(400).json({
            status: 0,
            data: null,
            error: "All fields are required"
        });
    }

    // Check if the SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
        return res.status(400).json({
            status: 0,
            data: null,
            error: "SKU already exists"
        });
    }

    const newProduct = await Product.create({
        name, sku, description, category, brand, price, quantity, lowStockAlert, supplier, purchaseDate
    });
    res.status(201).json({
        status: 1,
        data: newProduct,
        error: null,
    });
};


// get all produts
const getProducts = async (req, res) => {
    try {
        const { search, category, lowStock, page = 1, limit = 10 } = req.query

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { sky: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by category
        if (category && category !== "all") {
            query.category = category = category;
        }

        // Low stock filter 
        if (lowStock === "true") {
            query.quantity = { $lte: 5 };
        }

        const total = await Product.countDocuments(query);

        const products = await Product.find(query)
            .populate('brand', 'name')
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));


        res.status(200).json({
            status: 1,
            data: {
                products,
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
            },
            error: null
        })
    } catch (error) {
        res.status(400).json({
            status: 0,
            data: null,
            error: "Server error"
        })
    }
}


// cosnt getProductBySku
const getProductBySku = async (req, res) => {
    const { sku } = req.body;
    try {
        if (!sku) {
            return res.status(400).json({
                status: 0,
                data: null,
                error: "Please provide a sku"
            })
        }

        const product = await Product.findOne({ sku });
        if (!product) {
            return res.status(400).json({
                status: 0,
                data: null,
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
            data: null,
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
            data: null,
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
                data: null,
                error: "Invalid SKU!"
            });
        }
        if (action !== "restock" && action !== "ship") {
            return res.status(400).json({
                status: 0,
                data: null,
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
                data: null,
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
            data: null,
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