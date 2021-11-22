const jwt = require("jsonwebtoken");
const CustomAPIError = require("../errors/custom-error");
require("dotenv").config();

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  if (!username || !password) {
    throw new CustomAPIError(`Please provide email and password`, 400);
  }

  const id = new Date().getDate(); //MongoDB provides the id, this is just ficticious dummy data

  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({ msg: "user created", token });
};

const dashboard = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomAPIError(`Not token provided`, 400);
  }

  const token = authHeader.split(" ")[1];
  console.log(token);

  const luckyNumber = Math.random() * 100;
  res.status(200).json({
    msg: `Hello John Doe`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

module.exports = { login, dashboard };
