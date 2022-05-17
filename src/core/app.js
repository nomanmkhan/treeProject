const express = require("express");
const app = express();
const cors = require("cors");
const route = require("../routes");

app.use("/image", express.static('./upload/images'))
app.use(express.urlencoded({ extended: true, }));
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Custom-header");
    res.header("Access-Control-Expose-Headers", "X-Custom-header");
    next();
});
app.use(cors());
app.get('/',(req,res)=>{
    res.send("hello there")
})
app.use("/api", route);
module.exports = app;