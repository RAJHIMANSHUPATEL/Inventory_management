const express = require("express");
const { addCategory, updateCategory, getAllCategories } = require("../controllers/category.controller");

const router = express.Router()

router.get("/", getAllCategories)
router.post("/add-category", addCategory)
// router.post("/add-category", updateCategory)
module.exports = router;