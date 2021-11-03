const express = require("express");
const env = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const cors = require("cors");

const mongoose = require("mongoose");

// routes
const userRoutes = require("./routes/user.router");

// enviroment variable or you can say constant
env.config();

// mongodb connection

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);

mongoose
  .connect(
    "mongodb+srv://hieunguyen:Hieu2761998@cluster0.4f2ej.mongodb.net/NhomXanh?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
