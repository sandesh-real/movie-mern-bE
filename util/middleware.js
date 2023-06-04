const jwt=require("jsonwebtoken");
const multer=require("multer");
const HttpError = require("../model/error");
exports.getAuth = (req, res, next) => {

    if(req.method==='OPTIONS'){
        return next();
    }
    try{

        const token=req.headers.authorization.split(' ')[1]
        if(!token){
            throw new Error('Authentication failed')
        }
        const decodeToken=jwt.verify(token,process.env.SECRET_KEY)
        
        req.userInfo = { userId: decodeToken.userId };
      
        next();
    }
    catch(err){
            const error=new HttpError('Authentication failed',401);
            return next(error);
    }
};


const MIME_TYPE={
    'image/jpg':'jpg',
    'image/jpeg':'jpeg',
    'image/png':'png',
}
exports.fileUpload=multer({
    limits:500000,
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'uploads/images')
        },
        filename:(req,file,cb)=>{
            const ext=MIME_TYPE[file.mimetype];
            cb(null,`${new Date().toISOString()}.${ext}`)
        }

    }),
    fileFilter:(req,file,cb)=>{
        const isValid=!!MIME_TYPE[file.mimetype]
        const error=isValid?null:new Error("Invalid file type")
        cb(error,isValid)
    }
})