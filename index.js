const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");
const categoryRouter = require("./routes/category.route");
const brandRouter = require("./routes/brand.route");

// configure
require("dotenv").config();
require("./db/conn");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/product", productRouter);

app.get("/", (req, res) => {
    res.send("Inventory Backend");
});

// Listen locally, but export for Vercel
if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;
