const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleModel = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("article", articleModel);