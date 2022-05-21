const express = require("express");
const rout = require("./router");
const body_Parser = require("body-parser");
const app = express();
app.use(body_Parser.json({ limit: "50mb" }));
app.use(body_Parser.urlencoded({ limit: "50mb", extended: true }));
const cors = require("cors");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/user", rout);
app.use(express.urlencoded({ extended: true }));
app.listen(process.env.PORT || 5000, () => {});
