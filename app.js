const path=require("path");
const fs=require("fs");
const express=require("express");
const app=express();
const bodyParser=require("body-parser")


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const movieRouter=require('./routes/movie-route')
const userRouter=require("./routes/user-route");
const theaterRouter=require("./routes/theater-route");

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With,Content-Type,Accept,authorization"
    );
    res.setHeader('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH')
    next()
})

app.use('/uploads/images',express.static(path.join(__dirname,'uploads','images')))

app.use("/api/movies/", movieRouter);
app.use('/api/users',userRouter);
app.use("/api/theater", theaterRouter);
app.use((err,req,res,next)=>{
    if(req.file){
        fs.unlink(req.file.path)
    }
    console.log(err)
    if(err.status){
        err.status=500;
    }
    res.status(err.status).json({messge:err.message})
})


module.exports=app