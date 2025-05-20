const express = require("express");
const app = express();
const userRouter = require("./routes/user.route") 
require("dotenv").config();
require("./db/conn")

app.use(express.json())


app.use("/api", userRouter)
app.get("/", (req, res)=> {
    res.send("Inventory Backend");
})

app.listen(4000, ()=> {
    console.log("Server is trunning on port 4000");
})