const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "must provide name"], //[booolean, error message]
    trim: true, // removes leading and trailing whitespace (beginning and ending)
    maxlength: [50, "name can not be more than 20 characters"],
  },
  completed: { type: Boolean, default: false }, //default value
});

module.exports = mongoose.model("Task", TaskSchema); //CollectionName, SchemaName

//
