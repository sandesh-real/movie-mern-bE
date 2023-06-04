const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  releasedate: {
    type: Date,
    required: true,
  },
  directedBy: {
    type: String,
    required: true,
  },
  starring: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  runtime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  trailer: {
    type: String,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  movieshowtime: [{ date: { type: Date }, time: [{ type: String }] }],
});

module.exports = new mongoose.model("Movie", movieSchema);