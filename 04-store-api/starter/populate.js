require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");

const jsonProducts = require("./products.json");

const start = (async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    await Product.deleteMany();
    await Product.create(jsonProducts);

    console.log("sucess");
    process.exit(0); // Exit process since everything is looking good
  } catch (e) {
    console.error(e);
    process.exit(1); // Exit process since something went wrong
  }
})();
