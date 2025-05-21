const express = require("express");
const { addProduct, updateProductQuantity, getProducts, getProductBySku } = require("../controllers/product.controller");

const router = express.Router()

router.post("/add_product", addProduct);
router.get("/", getProducts);
router.post("/get_product", getProductBySku);
router.post("/update_product", updateProductQuantity);

module.exports = router;