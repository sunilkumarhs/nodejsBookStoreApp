const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodeMailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodeMailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.NODE_APP_SENDGRID_API,
    },
  })
);

exports.getLoginPage = (req, res, next) => {
  //   console.log(req.session.isLoggedIn);
  //   const loggedIn = req.get("Cookie").split(";")[0].split("=")[1] === "true";
  res.render("auth/login", {
    docTitle: "Login Page",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: req.flash("SigninError"),
  });
};

exports.postLoginData = (req, res, next) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("SigninError", "Invalid Email !!");
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
          req.flash("SigninError", "Invalid Password!!");
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
    errorMessage: req.flash("SignupError"),
  });
};

exports.postSignupData = (req, res, next) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  const confPassword = req.body.userCPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("SignupError", "Email already exists!!");
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
        .then((result) => {
          res.redirect("/auth/login");
          return transporter.sendMail({
            to: email,
            from: "puppetmaster010420@gmail.com",
            subject: "Successfull signup!",
            html: "<h1>You successfully signed-up!</h1>",
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
