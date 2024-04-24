const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const path = require("path");
const errorController = require("./components/controllers/error");
const User = require("./components/models/user");
// const mongoConnect = require("./utils/database").mongoConnect;
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.set("view engine", "pug");
app.set("views", "components/views");
const store = new MongoDbStore({
  uri: process.env.NODE_APP_MONGODB_URI_KEY,
  collection: "sessions",
});
app.use(
  session({
    secret: "puppet@master is secrect",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      // req.user = new User(
      //   user.userName,
      //   user.password,
      //   user.email,
      //   user.cart,
      //   user._id
      // );
      next();
    })
    .catch((err) => console.log(err));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(shopRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use(errorController.getErrorPage);
mongoose
  .connect(process.env.NODE_APP_MONGODB_URI_KEY)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));

// mongoConnect(() => {
//   app.listen(3000);
// });