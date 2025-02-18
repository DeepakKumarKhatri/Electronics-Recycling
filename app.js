var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var itemsRouter = require("./routes/items");
var pickRequestsRouter = require("./routes/pickup_requests");
var recycleHistoryRouter = require("./routes/recycle_history");
var rewardsRouter = require("./routes/rewards");
var searchRouter = require("./routes/search");
var dashboardRouter = require("./routes/dashboard");
var adminRouter = require("./routes/admin");

var app = express();

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/items", itemsRouter);
app.use("/api/pickup-requests", pickRequestsRouter);
app.use("/api/recycle-history", recycleHistoryRouter);
app.use("/api/rewards", rewardsRouter);
app.use("/api/search", searchRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

JSON.stringify = (function() {
  const originalStringify = JSON.stringify;
  return function(value, replacer, space) {
    return originalStringify(value, function(key, val) {
      // Convert BigInt to string
      if (typeof val === 'bigint') {
        return val.toString();
      }
      return replacer ? replacer(key, val) : val;
    }, space);
  };
})();

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
