const express = require("express");
const { loginUser, registerUser } = require("../controllers/user.controller");

const router = express.Router()

// register user
router.post("/register_user", registerUser);
router.post("/login_user", loginUser);


module.exports = router;