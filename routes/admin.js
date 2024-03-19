const express = require("express");
const adminController = require("../components/controllers/admin");

const routes = express.Router();

routes.get("/add-product", adminController.getAddProduct);
routes.get("/products", adminController.getProducts);
routes.post("/add-product", adminController.getPostProduct);

module.exports = routes;
