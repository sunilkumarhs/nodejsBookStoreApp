const express = require("express");
const shopController = require("../components/controllers/shop");

const routes = express.Router();

routes.get("/", shopController.getIndex);
routes.get("/products", shopController.getDisplayProducts);
routes.get("/products/:productId", shopController.getProductDetail);
routes.get("/cart", shopController.getCartProdcuts);
routes.get("/orders", shopController.getOrderedProdcuts);
routes.post("/cart", shopController.postCartProduct);
routes.get("/checkout", shopController.getCheckoutProdcuts);
routes.post(
  "/delete-product/:productId/:productPrice",
  shopController.postDeleteProduct
);
module.exports = routes;
