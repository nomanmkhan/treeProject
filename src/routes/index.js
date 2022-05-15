const express = require("express");
const router = express.Router();
const USER_CONTROLLER = require("../controller/user.controller")
const TREE_CONTROLLER = require("../controller/tree.controller")

const { authenticate } = require("../utils/authenticate")

//auth block
router.post("/register", USER_CONTROLLER.register);
router.post("/login", USER_CONTROLLER.login);

//jwt test
router.post("/allUsers", authenticate, USER_CONTROLLER.getUser);

router.post("/addTree", authenticate, TREE_CONTROLLER.addTree);
router.post("/trees", authenticate, TREE_CONTROLLER.getTrees);



module.exports = router;