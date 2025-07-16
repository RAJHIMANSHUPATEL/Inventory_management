const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
    },
    sku: {
        type: String,
        required: [true, "Product SKU is required"],
        unique: true,
        uppercase: true,
    },
    description: {
        type: String,
        default: "",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price must be a positive number"],
    },
    quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
        min: [0, "Quantity must be 0 or more"],
    },
    imageUrl: {
        type: String,
        default: "https://static4.depositphotos.com/1026560/369/i/600/depositphotos_3695113-stock-photo-indoor-warehouse.jpg",
    },
    lowStockAlert: {
        type: Boolean,
        default: false,
    },
    supplier: {
        type: String,
        required: [true, "Please add a supplier"],
    },
    purchaseDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
