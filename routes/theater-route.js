const express=require("express");
const router=express.Router();
const { getAuth } = require("../util/middleware");
const theaterController=require('../controller/theater-controller')
router.get("/", theaterController.getTheater);
router.post('/',theaterController.createTheater)
router.post("/theater-user",getAuth, theaterController.mixTheaterAndUser);

module.exports=router;

