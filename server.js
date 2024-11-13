require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { logger, logEvents } = require("./middleware/logger");
const errHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));

app.use("/login", require("./routes/authRoutes"));

app.use("/users", require("./routes/userRoutes"));

app.use("/logout", require("./routes/logoutRoutes"));

app.use("/tasks", require("./routes/taskRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "Sorry, 404 Not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errHandler);

mongoose.connection.once("open", () => {
  console.log("connected to Mongo DB");

  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  logEvents(
    `${err.no} : ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
