const express = require("express");
const router = express.Router();
const USER = require("../controller/user.controller")

const { authenticate } = require("../utils/authenticate")

//auth block
router.post("/register", USER.register);
router.post("/login", USER.login);

//jwt test
router.post("/allUsers", authenticate, USER.getUser);




module.exports = router;