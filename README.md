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

## 05-JWT-Basics

- json web tokens (JWT) insure that only the right people can edit the right data. If a valid token is present during a request, the user can access specific info (But not all the info!).

- JWT looks like a string. **The format is header.payload.signature**. Everything is encoded with base64Url encoding
  - The payload is where the information that was requested is sent. JWT Format:

Encoded format:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Decoded format:

```
HEADER
{
  "alg": "HS256",
  "typ": "JWT"
}

PAYLOAD (data)
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}

DATA - VERIFY SIGNATURE
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),

your-256-bit-secret

)
```

- **The package to sign and decode** tokens (in this course - There are actually many different packages) is jsonwebtoken

### jsonwebtoken package

Implement as following in controller/main.js:

```
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  if (!username || !password) {
    throw new CustomAPIError(`Please provide email and password`, 400);
  }

  const token = jwt.sign(payload, jwtSecretString, options); // signs token

  res.status(200).json({ msg: "user created", token }); // sends token to front end
};
```

- **payload** can be any data that you want to send.
  - **Never send the password as part of the payload!**
  - Keep the payload small for a better user experience (Smilga uses `{id, username}`)
- **jwtSecretString** must be a long random string that is unguessable
  - Save this in the .env file as JWT_SECRET
  - Smilga recommends [allkeysgenerator.com](https://allkeysgenerator.com) Encryption key > 256-bit

Example Token:

```
const token = jwt.sign(
  { id, username }, //payload
  process.env.JWT_SECRET, //jwtSecretString
  {expiresIn: process.env.JWT_LIFETIME} // options. In .env set JWT_LIFETIME=30d

);
```

**You should sign tokens by using schema methods.** Example:

```
// In models folder user.js
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_SECRET } // In .env set JWT_LIFETIME=30d
  );
};
```

- This course doesn't explain how jwt are stored on the front end :( But he does explain it briefly:

```
const { data } = await axios.post('/api/v1/login', { username, password })
localStorage.setItem('token', data.token)
```

```
const token = localStorage.getItem('token')
try {
  const { data } = await axios.get('/api/v1/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`, // Set the Authorizaiton within the Header!!!
    },
  })
  data.secret
} catch (error) {
  localStorage.removeItem('token')
  resultDOM.innerHTML = `<p>${error.response.data.msg}</p>`
}
```

### Error Handling

- In `root/errors/` create different files to handle different errors. Then import them all into `root/errors/index.js`
- You can use the package **http-status-codes** To help rename your errors in a readable way. **For example take a look at this:**

```
class BadRequest extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
```

**Versus This:**

```
const { statusCodes } = require("http-status-codes");

class BadRequest extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.BAD_REQUEST;
  }
}
```

## Password Hashing

- **NEVER EVER SAVE USER PASSWORDS AS STRINGS IN MONGODB**. You want to hash them instead
- Run `npm i bcryptjs`
- Here's how you implement **bcryptjs**:

```
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const salt = await bcrypt.genSalt(10); // Generates salt (random bytes). See below.
  const hashedPassword = await bcrypt.hash(password, salt); // generates the hashed password

  const tempUser = { name, email, password: hashedPassword };

  const user = await User.create({ ...tempUser });
  res.status(StatusCodes.CREATED).json(user);
};
```

- `bcrypt.genSalt(10)`: The number determines how many random bytes you'll get. A bigger number makes the password more secure, but requires more processing power. 10 is default.

- You can simplify the code above using schema.pre() which is middleware that executes before something is performed. Example:

```
// In the model
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); //Don't use arrow function so that `this` refers globally
  next();
});

// In the controller
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  res.status(StatusCodes.CREATED).json(user);
};

```

## Random Learnings

- `const { BadRequestError } = require("../errors");` will automatically point to index.js with the errors folder.
- Reference other documents by using `type: mongoose.Types.ObjectId`. Example:

```
const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "Please provide company name"],
    maxlength: 50,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User', // Model name you are referencing
  },
});
```
