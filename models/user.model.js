const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    phone: {
        type: String,
        required:[ true, "Phone number is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, ["Password is required"]],
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    address: {
        type: String,
    },
    role:{
        type: String,
        enum: ["admin", "accountant"],
        default: "admin"
    } 
}, {timeseries})

const User = new mongoose.model("User", userSchema);

module.exports = User;