const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");
const errorController = require("./components/controllers/error");
const sequelize = require("./utils/database");
const Product = require("./components/models/product");
const User = require("./components/models/user");

const app = express();

app.set("view engine", "pug");
app.set("views", "components/views");

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(shopRoutes);
app.use("/admin", adminRoutes);
app.use(errorController.getErrorPage);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync({ force: true })
  .then(() => {
    User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "Sunil", email: "puppet1718@gmail.com" });
    }
    return user;
  })
  .then((user) => app.listen(3000))
  .catch((err) => {
    console.log(err);
  });
