require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const getConnection = require("./server/configs/db");
const upload = require("./server/configs/multer");
const favicon = require("serve-favicon");

const app = express();

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/articulos";
const PORT = process.env.PORT || 3000;

getConnection();

app.use(favicon(__dirname + '/public/favicon.ico')); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "Quetzalcode",
    resave: false,
    saveUnitialized: true,
    store: MongoStore.create({
      mongoUrl: DATABASE_URL,
    }),
    cookie: { secure: false },
  })
);

app.use(express.static("public"));

app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/user"));
app.use("/", require("./server/routes/article"));
app.use("/", require("./server/routes/comment"));

app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}`);
});
