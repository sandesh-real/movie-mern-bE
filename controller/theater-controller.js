const User=require("../model/user")
const Theater = require("../model/theater");
const HttpError = require("../model/error");
exports.getTheater = async (req, res, next) => {

  const movieId = req.query.movieId;
  const time = req.query.time;
  const day=req.query.day
 
  try {
    const theater = await Theater.findOne({
      movieId: movieId,
      time: time,
      day,
    });

    if (!theater) {
      return next(new HttpError("Theater cannot found", 422));
    }
    

    res.status(200).json({theater });
  } catch (err) {
    next(new HttpError("Something went wrong", 500));
  }
};

exports.createTheater = async (req, res, next) => {
  const { time, date, movieId, soldTicket } = req.body;
  
  try {
    const theater = await Theater({
      time,
      date,
      movieId,
      soldTicket,
    });
   
    if (!theater) {
      return next(new HttpError("Theater cannot be created", 422));
    }
    await theater.save();
    res.status(201).json({ message: "Theater successfully created" });
  } catch (err) {
    console.log(err)
    next(new HttpError("Something went wrong", 500));
  }
};

exports.mixTheaterAndUser=async (req,res,next)=>{
  const userId = req.userInfo.userId
  const { movieId, movieTitle, ticketDate, time,day,movieWatchingDay } = req.body;
 
  try{
    const user=await User.findById(userId)
    if(!user){
      return next(new HttpError("user not found"),422)
    }
    let ticketIndex = user.ticket.findIndex((item) => {
      return (
        item.movieTitle === movieTitle &&
        item.time === time &&
        item.ticketDate === ticketDate && item.isPaid===false &&
        item.day===day
      );
    });
    if(ticketIndex<0){
      return next(new HttpError("Please select ticket first"), 422);
    }
    const oldTicket=user.ticket[ticketIndex];
  
   const theater= await Theater.findOne({date:oldTicket.ticketDate,time:oldTicket.time,movieId:movieId,day:oldTicket.day})
        oldTicket.isPaid = true;
        oldTicket.movieWatchingDay=new Date();
        user.ticket[ticketIndex]=oldTicket
       const allSoldSeat= user.ticket[ticketIndex].seats.map((item)=>{
          return {[item.seatAlph]:item.seatNum}
        })
        theater.soldTicket=[...theater.soldTicket,...allSoldSeat];
        await user.save();
        await theater.save();

    res.json({message:"hahah"})


  }
  catch(err){
      next(new HttpError("Something went wrong"), 422);
  }
}