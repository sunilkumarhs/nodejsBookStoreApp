const express = require("express");
const adminController = require("../components/controllers/admin");
const isAuth = require("../middleware/is-auth");
const routes = express.Router();

routes.get("/add-product", isAuth, adminController.getAddProduct);
routes.get("/products", isAuth, adminController.getProducts);
routes.post("/add-product", adminController.getPostProduct);
routes.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
routes.post("/edit-product/:productId", adminController.getPostEditProduct);
routes.post("/delete-product/:productId", adminController.getDeleteCompleted);

module.exports = routes;
