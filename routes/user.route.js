const express = require("express");
const User = require("../models/user.model");

const router = express.Router()

// register user
router.post("/register_user", resisterUser);


module.exports = router;