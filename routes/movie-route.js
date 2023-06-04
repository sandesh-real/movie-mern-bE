const express=require("express");
const router=express.Router();
const { getAuth } = require("../util/middleware");
const { fileUpload } = require("../util/middleware");
const movieController=require("../controller/movie-controller");
router.get("/", movieController.getAllMovie);
router.get("/movie/:movieId",movieController.getMovie);
router.post('/',getAuth, fileUpload.single('image'),movieController.createMovie);

module.exports=router;