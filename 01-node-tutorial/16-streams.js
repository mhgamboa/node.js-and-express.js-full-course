const { createReadStream } = require("fs");

const stream = createReadStream("./01-node-tutorial/content/big.txt", {
  encoding: "utf8",
});

stream.on("data", (result) => {
  console.lot(result);
});

stream.on("error", (err) => {
  console.log(err);
});
