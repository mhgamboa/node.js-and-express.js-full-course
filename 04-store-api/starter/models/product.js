const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "product name must be provided"], //[boolean, custom error message]
  },
  price: {
    type: Number,
    required: [true, "product price must be provided"], //[boolean, custom error message]
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"], // Limits the company value to being these 4 options
      message: "{VALUE} is not supported", //Error message if they don't provide any enum value
    },
  },
});

module.exports = mongoose.model("Product", productSchema);
