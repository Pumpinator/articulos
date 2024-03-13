require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const getConnection = require("./server/configs/db");

const app = express();
const PORT = process.env.PORT || 80;

getConnection();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));

app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}`);
});
