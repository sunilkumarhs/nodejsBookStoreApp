const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const path = require("path");
const errorController = require("./components/controllers/error");
const User = require("./components/models/user");
// const mongoConnect = require("./utils/database").mongoConnect;
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const dotenv = require("dotenv");
const csrf = require("csurf");
const flash = require("connect-flash");
const multur = require("multer");
const connectDB = require("./utils/database");

dotenv.config();

const app = express();

connectDB();

const store = new MongoDbStore({
  uri: process.env.NODE_APP_MONGODB_URI_KEY,
  collection: "sessions",
});

const csrfProtection = csrf();
const fileStorage = multur.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${new Date().toISOString().split(":").join("")}-${file.originalname}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "components/views"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multur({ storage: fileStorage, fileFilter: fileFilter }).single("imgUrl")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "puppet@master is secrect",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
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
    .catch((err) => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  // res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use("/",shopRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/500", errorController.getErrorPage500);
app.use(errorController.getErrorPage);
// app.use((error, req, res, next) => {
//   res.status(500).render("500", {
//     docTitle: "Server Error",
//     path: "/500",
//     isAuthenticated: req.session.isLoggedIn,
//   });
// });
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// mongoConnect(() => {
//   app.listen(3000);
// });