const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const theaterSchema = new Schema({
  time: {
    type: String,
    required: true,
  },
  day:String,
  date: { type: Date, required: true },
  movieId: { type: mongoose.Types.ObjectId, required: true,ref:"Movie" },
  soldTicket:[]
  
});

module.exports = new mongoose.model("Theater", theaterSchema);