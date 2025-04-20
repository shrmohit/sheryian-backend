const { name } = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/testapp1");

const userSchema = new mongoose.Schema({
  Image: String,
  name: String,
  email: String,
});

module.exports = mongoose.model("user", userSchema);
