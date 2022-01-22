const express = require("express");
const env = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const cors = require("cors");

const mongoose = require("mongoose");

// routes
const initialDataRoutes = require("./routes/admin/initial");
const userRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const manageUserRoutes = require("./routes/admin/manageUser");
const imageUploadRoutes = require("./routes/imageUpload.route");
const cartRoutes = require("./routes/cart.route");
const manageProductRoutes = require("./routes/admin/managerProduct");
const productRoutes = require("./routes/product");
const manageOrderRoutes = require("./routes/admin/order");
const orderRoutes = require("./routes/order");
const stripeCheckout = require("./routes/stripe.checkout");
const managePost = require("./routes/admin/managePost");
const postRoutes = require("./routes/post");
const manageReportRoutes = require("./routes/admin/report");
const manageNewsRoutes = require("./routes/admin/managerNew");
const summaryRoutes = require("./routes/admin/summary");
const loyalUserRoutes = require("./routes/admin/loyalUser");

// enviroment variable or you can say constant
env.config();

// mongodb connection

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", manageUserRoutes);
app.use("/api", initialDataRoutes);
app.use("/api/image", imageUploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/product/admin", manageProductRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order/admin", manageOrderRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/stripe", stripeCheckout);
app.use("/api/post/admin", managePost);
app.use("/api/post", postRoutes);
app.use("/api/report/admin", manageReportRoutes);
app.use("/api/new/admin", manageNewsRoutes);
app.use("/api/loyal/admin", loyalUserRoutes);
app.use("/api/summary", summaryRoutes);

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
