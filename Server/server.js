const express = require("express");
require("dotenv").config();
const app = express();
const routes = require("./Routes/index");
const morgan = require("morgan");
let bodyParser = require("body-parser");
const cors = require("cors");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: "GET,POST", 
    allowedHeaders: "Content-Type,Authorization", 
  })
);

app.use("/", routes);
app.get("/", (req, res) => {
  res.send("Welcome to the Express.js server with Sequelize and MySQL!");
});
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // Return a 204 No Content response
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
