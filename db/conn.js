const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://noah:noahXsaviour@cluster0.qxtvhpy.mongodb.net/?retryWrites=true&w=majority&appName=InventoryManagement")
.then(console.log("DB connection successful"))
.catch((error)=> {
    console.log(error)
})

