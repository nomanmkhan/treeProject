require("../config/db");
const app = require("./app")
const server = require('http').createServer(app);
server.listen(process.env.PORT || 80, () => {
    console.log("server is running on: ", process.env.PORT)

})


