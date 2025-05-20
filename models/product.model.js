const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
    },
    sku: {
        type: String, 
        required: [true, "Product SKU is requried"],
        unique: true,
        uppercase: true,
    },
    description: {
        type: String,
        default: "",
    },
    category: {
        type: String,
        required: true,
        enum: ["electronics", "clothing", "office", "food", "other"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price must be positive number"],
    },
    quantity: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Qunatity must be 0 or more"],
    },
    imageUrl: {
        type: String,
        default: "https://static4.depositphotos.com/1026560/369/i/600/depositphotos_3695113-stock-photo-indoor-warehouse.jpg",
    },
    lowStockAlert: {
        type: Boolean,
        default: false,
    },
    // createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true,
    // },
}, {timeseries})

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;