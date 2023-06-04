const User = require("../model/user");
const HttpError = require("../model/error");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    if (users.length === 0) {
      return next(new HttpError("Users cannot found", 422));
    }
     
    res
      .status(200)
      .json({ users: users.map((item) => item.toObject({ getters: true })) });
  } catch (err) {
    next(new HttpError("Something went wrong", 500));
  }
};
exports.getUserById = async (req, res, next) => {

  const userId = req.userInfo.userId;
  try {
    const user = await User.findById(userId).select("-password");
    // user.ticket=user.ticket.filter((item)=>{
    //   return new Date(item.movieWatchingDay).getTime() >= new Date().getTime();
    // })
    if (!user) {
      return next(new HttpError("User cannot found", 422));
    }
    res.status(200).json({ user:user.toObject({getters:true}) });
  } catch (err) {
    next(new HttpError("Something went wrong", 500));
  }
};



exports.tempTicket = async (req, res, next) => {
  const { ticket } = req.body;
  const userId=req.userInfo.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("User cannot found", 422));
    }
    if(ticket.seats.length===0){

        user.ticket = [];
    }
    else{
                let ticketIndex = user.ticket.findIndex((item) => {
                    
                  return (
                    item.movieTitle === ticket.movieTitle &&
                    item.time === ticket.time &&
                    item.ticketDate === ticket.ticketDate &&
                    item.day===ticket.day
                  );
                });
             
                 let newTicket=null;
        if(ticketIndex>=0){

             newTicket = user.ticket[ticketIndex];
        }
      
        if (newTicket) {
          if (!ticket.isPaid) {
            newTicket = ticket;
            user.ticket[ticketIndex]=newTicket
          }
          else{
            user.ticket.push(ticket)
            
          }
        }
        else{
            user.ticket.push(ticket)
        }
    }
  
    await user.save();
    res.status(200).json({ message: "ticket added" });
  } catch (err) {
    console.log(err);
    next(new HttpError("Something went wrong", 500));
  }
};
exports.createUser = async (req, res, next) => {
  const { name, email, password, ticket } = req.body;
  try {
    const oldUser=await User.findOne({ email: email });
    if(oldUser){
      return next(new HttpError("User with that email already exist", 422));
    }
    const hashPassword=await bcrypt.hash(password,12)
    const user = await User({
      name,
      email,
      password:hashPassword,
      ticket,
    });
    if (!user) {
      return next(new HttpError("User cannot created", 422));
    }

    await user.save();
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

    res.status(201).json({ message: "successfully created",token:token });
  } catch (err) {
    next(new HttpError("Something went wrong", 500));
  }
};
exports.login=async (req,res,next)=>{
  const {email,password}=req.body;
 
try{
   const user=await User.findOne({email:email})
   
   if(!user){
       return next(new HttpError("User with that email does not exist", 422));
   }


  const isValid = await bcrypt.compare(password,user.password);
  if(!isValid){
      return next(new HttpError("Password does not match", 422));
  }
  const token = jwt.sign({
    userId:user._id,email:user.email
  },process.env.SECRET_KEY,{expiresIn:'1h'})

  res.status(200).json({message:"Successfully logined",token:token})
}
catch(err){
   return next(new HttpError("Something went wrong", 500));
}
}