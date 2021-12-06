const express = require("express");
const tasks = require("./routes/tasks");
const connectDB = require("./db/connect");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();
require("dotenv").config();
const port = process.env.PORT || 8000;
const uri = process.env.MONGO_URI;

// middleware
app.use(express.static("./public"));
app.use(express.json()); //Parses all incoming responses. Assumes all incoming requests are json
app.use(errorHandlerMiddleware);

// routes
app.use("/api/v1/tasks", tasks);

app.use("/", notFound);

// Server/DB Connection

const start = async () => {
  try {
    await connectDB(uri);
    app.listen(port, () =>
      console.log(
        `Server is listening on port ${port} (http://localhost:8000/)`
      )
    );
  } catch (err) {
    console.error(err);
  }
};

start();
