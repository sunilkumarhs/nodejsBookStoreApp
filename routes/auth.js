const express = require("express");
const authController = require("../components/controllers/auth");
const routes = express.Router();

routes.get("/login", authController.getLoginPage);
routes.post("/login", authController.postLoginData);
routes.post("/logout", authController.postLogout);
routes.get("/signup", authController.getSignupPage);
routes.post("/signup", authController.postSignupData);

module.exports = routes;
