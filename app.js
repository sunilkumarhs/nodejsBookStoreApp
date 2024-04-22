const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");
const errorController = require("./components/controllers/error");
const User = require("./components/models/user");
// const mongoConnect = require("./utils/database").mongoConnect;
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "pug");
app.set("views", "components/views");

app.use((req, res, next) => {
  User.findById("6626358094e66f9755353558")
    .then((user) => {
      req.user = user;
      // req.user = new User(
      //   user.userName,
      //   user.password,
      //   user.email,
      //   user.cart,
      //   user._id
      // );
      // console.log(req.user);
      next();
    })
    .catch((err) => console.log(err));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(shopRoutes);
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