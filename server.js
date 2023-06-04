const path=require('path')
const mongoose=require('mongoose');

const dotenv=require("dotenv");
dotenv.config()
const app=require("./app");

mongoose.connect(
  `mongodb+srv://firecountry90:${process.env.DB_PASSWORD}@cluster0.wpjondw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
).then((res)=>{
    app.listen(5000,(err)=>{
        console.log('connnected');
        console.log(err)
    })
    
})