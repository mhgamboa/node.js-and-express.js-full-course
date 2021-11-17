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

- **Sorting data** is pretty easy.
  - In Postman use `?sort=-name,price`. This will sort by name first, and then price
  - Then you'll have to use cursor functions with chaining. Here's a real world example:

```
const { featured, company, name, sort } = req.query;

let result = Product.find(queryObject);

if (sort) {
  const sortList = sort.replace(",", " "); // postman requests should be sent as explained above. Sort request objects can be sen

  result = result.sort(sortList);
} else {
  result = result.sort("createdAt"); // If there's nothing to sort, then sort by created date
}

const products = await result;
```

- **Projecting Data**: To show what data to project you use the `.select({name: 1, occupation: 1, _id: 0})` cursor function.
  - For some reason ([Maybe it's just Mongoose](https://mongoosejs.com/docs/api/query.html#query_Query-select)) you can also type this: `.select("name price -_id")`. This is also true of the sort cursor function as well
- **`.skip()` and `.limit()`** are also cursor functions, and only accept numbers. Example: `result = result.skip(skip).limit(limit);`

- To **filter with comparison operators** (>, <=>, etc.), you have to use the normal MongoDB syntax `.find({ fieldToCompare: { $comparison: comparisonValue } })`. Example:

```
const products = await Product.find({ price: { $gt: 30, $lt: 1000 } })
    .sort("price")
    .select("name price -_id");
```

- Implementing this with custom requests is pretty tricky. In postman have the user submit `?numericFilters=price>40,rating>=4`. Then to create the correct query object here is what Mr. Smilga did:

```
const getAllProducts = async (req, res) => {
  const { numericFilters } = req.query;
...
  if (numericFilters) {
      const operatorMap = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
      };
      const regEx = /\b(>|>=|=|<|<=)\b/g;
      let filters = numericFilters.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );
      const options = ["price", "rating"]; // Only allow numericFilters on price and rating fields
      filters = filters.split(",").forEach((item) => {
        const [field, operator, value] = item.split("-");
        if (options.includes(field)) {
          queryObject[field] = { [operator]: Number(value) };
        }
      });
    }
}
```

- This is a long complicated code that essentially creates an object for the correct comparison queries the postman submits
