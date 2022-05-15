const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, }, (err) => {
    if (err) {
        console.log(err)
        console.log("Error occurred while Connection wih Database");
    }
    else {
        console.log("Database connection successfully established");
    }
})
