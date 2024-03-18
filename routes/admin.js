const express = require("express");
const productController = require("../components/controllers/product");

const routes = express.Router();

routes.get("/add-product", productController.getAddProduct);
routes.post("/add-product", productController.getPostProduct);

module.exports = routes;
