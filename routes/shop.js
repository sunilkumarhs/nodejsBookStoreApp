const express = require("express");
const shopController = require("../components/controllers/shop");
const isAuth = require("../middleware/is-auth");
const routes = express.Router();

routes.get("/", shopController.getIndex);
routes.get("/products", shopController.getDisplayProducts);
routes.get("/products/:productId", shopController.getProductDetail);
routes.get("/cart", isAuth, shopController.getCartProdcuts);
routes.get("/orders", isAuth, shopController.getOrderedProdcuts);
routes.post("/cart", shopController.postCartProduct);
// // routes.get("/checkout", shopController.getCheckoutProdcuts);
routes.post("/delete-product/:productId", shopController.postDeleteProduct);
routes.post("/post-orders", shopController.postOrderProducts);
routes.post("/delete-order/:orderId", shopController.postDeleteOrder);
module.exports = routes;
