const { XLOCK } = require("sequelize/lib/table-hints");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getLoginPage = (req, res, next) => {
  //   console.log(req.session.isLoggedIn);
  //   const loggedIn = req.get("Cookie").split(";")[0].split("=")[1] === "true";
  res.render("auth/login", {
    docTitle: "Login Page",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLoginData = (req, res, next) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/auth/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((isAuth) => {
          if (isAuth) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) {
                console.log(err);
              }
              res.redirect("/");
            });
          }
          return res.redirect("/auth/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/auth/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignupPage = (req, res, next) => {
  res.render("auth/signup", {
    docTitle: "SignUp Page",
    path: "/signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postSignupData = (req, res, next) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  const confPassword = req.body.userCPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/auth/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => res.redirect("/auth/login"));
    })
    .catch((err) => console.log(err));
};