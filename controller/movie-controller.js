const Movie = require("../model/movie");
const HttpError=require('../model/error');
const Theater=require("../model/theater")
const {changeDateToDay}=require("../util/datePrice");
const mongoose=require("mongoose");
exports.getAllMovie = async (req, res, next) => {

  try{
    let movies=await Movie.find()
    if(movies.length===0){
      return next(new HttpError("Movies list is empty",404))
    }
   let moviesToDelete= movies.filter((item)=>{
      console.log(new Date().getDate() - new Date(item.releasedate).getDate());
      if(new Date().getDate()-new Date(item.releasedate).getDate()>7){
        return item;
      }
    })
    let moviesToDeleteId = moviesToDelete.map((item)=>{
      return item._id;
    })
    if (moviesToDelete.length>0){
      let allTheater=await Theater.find({ movieId: moviesToDeleteId[0] });
      await Theater.deleteMany({_id:allTheater.map((item)=>item._id)})
      await Movie.deleteMany({ _id: moviesToDeleteId });

    }
      res
        .status(200)
        .json({
          movies: movies.map((movie) => movie.toObject({ getters: true })),
        });
  }
  catch(err){
    next(new HttpError('Something went wrong',500))
  }
 
};
exports.getMovie=async (req,res,next)=>{
  try{
 
  let movie = await Movie.findById(req.params.movieId)
    movie = movie.toObject({
      getters: true,
    });
        console.log(movie);
       let theaters = await Theater.find({movieId:movie._id});
 

 movie.movieshowtime= movie.movieshowtime.map((item,i)=>{
 
    if(item.day===changeDateToDay(item.date,i)){
      return;
    }
     item.day = changeDateToDay(item.date,i);

    theaters= theaters.map(th=>{
     if( th.day===item.day){
      
     th.day = changeDateToDay(th.date,i)
     }
    //  console.log(th)
     return th.day
     })
     return item;
  })
  
 
    
    if(!movie){
    const error=new HttpError('Movie with that Id does not exist',422)
    return next(error);
    }
   
    res.status(200).json({movie:movie})
  }
  catch(err){
       const error = new HttpError("Something went wrong", 422);
       return next(error);
  }
}

exports.createMovie = async (req, res, next) => {
 
      
  let {
    title,
    releasedate,
    directedBy,
    starring,
    genre,
    runtime,
    status,
   
    trailer,
    movieshowtime,
    synopsis,
  } = req.body;
  movieshowtime=movieshowtime.split(',')
  try {
    const newMovie = await new Movie({
      title,
      releasedate,
      directedBy,
      starring,
      genre,
      runtime,
      status,
      image: req.file.path,
      trailer,
      movieshowtime: [
        { date: releasedate, time: movieshowtime },
        { date: releasedate, time: movieshowtime },
      ],
      synopsis,
    });
    const sess=await mongoose.startSession();
    sess.startTransaction();
    await newMovie.save({session:sess});
    

    let bigTheaterArray=[];
    newMovie.movieshowtime.forEach((show,i)=>{
      var newTheater = show.time.map((item) => {
        return {
          time: item,
          day: changeDateToDay(releasedate, i),
          date: newMovie.releasedate,
          movieId: newMovie._id,
        };
      });
       
      bigTheaterArray=bigTheaterArray.concat(newTheater)

    })

      await Theater.insertMany(bigTheaterArray, { session: sess });
        await sess.commitTransaction()
    


    res.status(201).json({message:"Movie Successfully created"})

  } catch (err) {
    console.log(err)
    return next(new HttpError('Movie Cannot be created',500))
  }
};
