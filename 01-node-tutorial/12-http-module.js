const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("Home Page");
  } else if (req.url === "/about") {
    res.end("About Page");
  } else {
    res.end(`
      <h1>Ooops!</h1>
      <p>We can't find the page you're looking for</p>
      <a href="/"> Go Back Home</a>
      `);
  }
});
server.listen(5000);

// http://localhost:5000/
