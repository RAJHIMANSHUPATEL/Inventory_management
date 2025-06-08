const express = require("express");
const cors = require("cors")
const userRouter = require("./routes/user.route") 
const productRouter = require("./routes/product.route")
const categoryRouter = require("./routes/category.route") 
const brandRouter = require("./routes/brand.route") 

// configure
require("dotenv").config();
require("./db/conn")

const app = express();

// middlewares
app.use(cors())
app.use(express.json())


// routes 
app.use("/api/user", userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/brand", brandRouter)
app.use("/api/product", productRouter)


app.get("/", (req, res)=> {
    res.send("Inventory Backend");
})

app.listen(4000, ()=> {
    console.log("Server is trunning on port 4000");
})