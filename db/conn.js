const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(console.log("DB connection successful"))
.catch((error)=> {
    console.log(error)
})

