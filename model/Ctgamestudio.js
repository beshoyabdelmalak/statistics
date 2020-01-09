const mongoose = require("mongoose");

var ObjectId = mongoose.Schema.Types.ObjectId;
var CtgamestudioSchema = new mongoose.Schema({
  blockly: String,
  level: String,
  event: String,
  title: String,
  owner: ObjectId,
  publishedDate: Date,
  tool: String
});

// mongoose.model("Ctgamestudio", CtgamestudioSchema)
module.exports = mongoose.model("Ctgamestudio", CtgamestudioSchema);
