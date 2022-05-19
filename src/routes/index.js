const express = require("express");
const router = express.Router();
const USER_CONTROLLER = require("../controller/user.controller")
const TREE_CONTROLLER = require("../controller/tree.controller")
const WORK_CONTROLLER = require("../controller/work.controller")

const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage: storage
})

const { authenticate } = require("../utils/authenticate")

//auth block
router.post("/register", USER_CONTROLLER.register);
router.post("/login", USER_CONTROLLER.login);

//Tree
router.post("/addTree", authenticate, TREE_CONTROLLER.addTree);
router.post("/trees", TREE_CONTROLLER.getTrees);
router.post("/treesByUser", authenticate, TREE_CONTROLLER.treesByUser);
router.get("/tree/:id", authenticate, TREE_CONTROLLER.getOneTree);
router.get("/deleteTree/:id", authenticate, TREE_CONTROLLER.deleteTree);
router.post("/updateTree/:id", authenticate, TREE_CONTROLLER.updateTree);

//Work List
router.post("/addWork", authenticate, WORK_CONTROLLER.addWork)
router.get("/deleteWork/:id", authenticate, WORK_CONTROLLER.deleteWork)
router.post("/workByUser", authenticate, WORK_CONTROLLER.getWorkByUser)
router.post("/getWork", authenticate, WORK_CONTROLLER.getWork) //for tehnical
router.post("/updateWork/:id", upload.single('image'), authenticate, WORK_CONTROLLER.updateWork) //for tehnical


module.exports = router;