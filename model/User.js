const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  password: String,
  email: String,
  isAdmin: Boolean,
  docLevelSec: Array,
  lms: Array,
  name: Object
});

module.exports = mongoose.model("User", UserSchema);
