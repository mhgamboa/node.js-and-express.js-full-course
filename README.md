# node.js-and-express.js-full-course

Thank you [John Smilga](https://www.youtube.com/c/CodingAddict) and [FreeCodeCamp](https://www.freecodecamp.org/) for posting this [awesome Youtube course](https://youtu.be/Oe421EPjeBE)!

- Make sure to have node installed. To run an app in nod enter `node fileName.js` into the console

## 04-store-api

- Your controllers need try catch blocks which creates a lot of boilerplate. Instead run `npm i express-async-errors` and require it `require("express-async-errors");` at the beginning of app.js. (In your controller throw an error (`throw new Error("testing async errors");`) instead of using next????)

- use **populate.js** to add multiple items to your database at a time. You essntially just connect to the database with `await connectDB(process.env.MONGO_URI);` and run `await Product.create(jsonArray);` with jsonArry being an array of json objects. (The `Product.deleteMany()` is just to reset everything if we run the function again)

- **You can attach key/value pairs in a get request to your api**. Example: `URL.com/api/v1/products?name=superCoolProduct&price=30`
  - Your api will recieve this data as `req.query.name` and `req.query.superCooleProduct`
  - With queries you will probably have to send your own query object to the DB to insure nothing breaks. Example:

```
const getAllProducts = async (req, res) => {
  const { featured } = req.query;

  const queryObject = {};
  if (featured) { // only execute if query object exists
    queryObject.featured = featured === "true" ? true : false;
  }

  const products = await Product.find(queryObject);
  res.status(200).json({ products, nbHits: products.length });
};
```

- **You can also use regex to search for values** EX:

```
const products = await Product.find({
    name: { $regex: search, $options: `i` },
  });
```
