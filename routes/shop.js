const express = require("express");
const productController = require("../components/controllers/product");

const routes = express.Router();

routes.get("/", productController.getDisplayProducts);

module.exports = routes;
