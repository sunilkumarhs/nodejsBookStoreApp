const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");
const errorController = require("./components/controllers/error");
const User = require("./components/models/user");
const mongoConnect = require("./utils/database").mongoConnect;

const app = express();

app.set("view engine", "pug");
app.set("views", "components/views");

app.use((req, res, next) => {
  User.findUserById("6623ab0c0fd516852ad02569")
    .then((user) => {
      req.user = new User(
        user.userName,
        user.password,
        user.email,
        user.cart,
        user._id
      );
      next();
    })
    .catch((err) => console.log(err));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(shopRoutes);
app.use("/admin", adminRoutes);
app.use(errorController.getErrorPage);

mongoConnect(() => {
  app.listen(3000);
});