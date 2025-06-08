const express = require("express");
const { addProduct, updateProductQuantity, getProducts, getProductBySku } = require("../controllers/product.controller");
const { addBrand, getAllBrands } = require("../controllers/brand.controller");

const router = express.Router()

router.get("/", getAllBrands)
router.post("/add-brand", addBrand)

module.exports = router;