const express = require("express");
const authController = require("../components/controllers/auth");
const routes = express.Router();
const { query, body } = require("express-validator");
const { check } = require("express-validator");
const User = require("../components/models/user");

routes.get("/login", authController.getLoginPage);
routes.post("/login", authController.postLoginData);
routes.post("/logout", authController.postLogout);
routes.get("/signup", authController.getSignupPage);
routes.post(
  "/signup",
  [
    check("userEmail")
      .isEmail()
      .withMessage("Please enter valid email!")
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject("Email already exists!!");
        }
        if (value === "test@test.com") {
          throw new Error("This kind of email's are forbidden");
        }
        return userDoc;
      })
      .normalizeEmail(),
    body(
      "userPassword",
      "Please enter the password length of atleast 7 or grater with one or more special character and numbers"
    )
      .trim()
      .isStrongPassword({
        minLength: 7,
        minUppercase: 1,
        minLowercase: 2,
        minSymbols: 1,
        minNumbers: 2,
      }),
    body("userCPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.userPassword) {
          throw new Error("Passwords did't match!");
        }
        return true;
      }),
  ],
  authController.postSignupData
);
routes.get("/reset", authController.getResetPage);
routes.post("/reset", authController.postResetData);
routes.get("/changePassword/:token", authController.getChangePassword);
routes.post(
  "/changePassword",
  [
    body(
      "password",
      "Please enter the password length of atleast 7 or grater with one or more special character and numbers"
    ).isStrongPassword({
      minLength: 7,
      minUppercase: 1,
      minLowercase: 2,
      minSymbols: 1,
      minNumbers: 2,
    }),
    body("confPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords did't match!");
      }
      return true;
    }),
  ],
  authController.postChangePasswordData
);
module.exports = routes;
