const express = require("express");
const adminController = require("../components/controllers/admin");

const routes = express.Router();

routes.get("/add-product", adminController.getAddProduct);
routes.get("/products", adminController.getProducts);
routes.post("/add-product", adminController.getPostProduct);
routes.get("/edit-product/:productId", adminController.getEditProduct);
routes.post("/edit-product/:productId", adminController.getPostEditProduct);
routes.post("/delete-product/:productId", adminController.getDeleteCompleted);

module.exports = routes;
