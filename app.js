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

const app = express();

app.set("view engine", "pug");
app.set("views", "components/views");
const mongoDbUri =
  "mongodb+srv://puppet1718:Puppet010420@cluster010420.tdgtki9.mongodb.net/mshop";
const store = new MongoDbStore({
  uri: mongoDbUri,
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

mongoose.connect("mongodb+srv://puppet1718:Puppet010420@cluster010420.tdgtki9.mongodb.net/mshop?retryWrites=true&w=majority&appName=Cluster010420").then(result => {
  User.findOne().then((user) => {
    if(!user) {
      const user = new User({
        name:"sunil",
        email:"pupet1718@gmail.com",
        cart:{
          items:[]
        }
      })
      user.save();
    }
  })
  app.listen(3000);
}).catch(err => console.log(err));

// mongoConnect(() => {
//   app.listen(3000);
// });