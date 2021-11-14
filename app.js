const express = require("express");
const env = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const cors = require("cors");

const mongoose = require("mongoose");

// routes
const userRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const manageUserRoutes = require("./routes/admin/manageUser");
const imageUploadRoutes = require("./routes/imageUpload.route");

// enviroment variable or you can say constant
env.config();

// mongodb connection

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", manageUserRoutes);
app.use("/api/image", imageUploadRoutes);

mongoose
  .connect(
    "mongodb+srv://hieunguyen:Hieu2761998@cluster0.4f2ej.mongodb.net/NhomXanh?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(process.env.PORT || 8000);
    console.log("app listening on port 8000");
  })
  .catch((err) => {
    console.log(err);
  });
