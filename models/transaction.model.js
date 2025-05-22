const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["purchase", "sale", "return", "adjustment"],
            required: true,
        },

        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [0, "Quantity cannot be negative"],
                },
                price: {
                    type: Number,
                    required: true,
                    min: [0, "Price cannot be negative"],
                },
            },
        ],

        date: {
            type: Date,
            default: Date.now,
        },

        totalAmount: {
            type: Number,
            required: true,
            min: [0, "Total amount cannot be negative"],
        },

        reference: {
            type: String,
            default: "",
            trim: true,
        },

        note: {
            type: String,
            default: "",
            trim: true,
        },
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction