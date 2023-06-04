const express=require("express");
const userController=require("../controller/user-controller")
const { getAuth } = require("../util/middleware");
router=express.Router();
router.get("/",getAuth, userController.getAllUser);
router.post("/ticket", getAuth,userController.tempTicket);
router.get("/user", getAuth,userController.getUserById);
router.post("/signup", userController.createUser);
router.post("/login", userController.login);

module.exports=router;