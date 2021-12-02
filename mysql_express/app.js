var createError = require("http-errors");
var express = require("express");
require("dotenv").config({ path: ".env" });
var cors = require("cors");
var path = require("path");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");

var app = express();
var corsOption = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOption));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
var options = {
  host: `${process.env.DB_HOST}`,
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASS}`,
  database: `${process.env.DB_NAME}`,
  port: 3306,
};
var sessionStore = new MySQLStore(options);
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    // store: sessionStore,
    cookie: { secure: false, maxAge: 24000 * 60 * 60, httpOnly: true },
    unset: "destroy",
  })
);

// session middleware
app.use(function (req, res, next) {
  res.set("credentials", "include");
  res.set("Access-Control-Allow-Credentials", true);
  res.set("Access-Control-Allow-Origin", req.headers.origin);
  res.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.set(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.listen(3010, function () {});
module.exports = app;
