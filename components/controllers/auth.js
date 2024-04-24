const { XLOCK } = require("sequelize/lib/table-hints");
const User = require("../models/user");

exports.getLoginPage = (req, res, next) => {
  //   console.log(req.session.isLoggedIn);
  //   const loggedIn = req.get("Cookie").split(";")[0].split("=")[1] === "true";
  res.render("auth/login", {
    docTitle: "Login Page",
    path: "/login",
    isAuthenticated: false,
  });
};

exports.postLoginData = (req, res, next) => {
  User.findById("6626358094e66f9755353558")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
    })
    .then((result) =>
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      })
    )
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
