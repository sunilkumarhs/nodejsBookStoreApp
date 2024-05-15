const express = require("express");
const shopController = require("../components/controllers/shop");
const isAuth = require("../middleware/is-auth");
const routes = express.Router();

routes.get("/", shopController.getIndex);
routes.get("/products", shopController.getDisplayProducts);
routes.get("/products/:productId", shopController.getProductDetail);
routes.get("/cart", isAuth, shopController.getCartProdcuts);
routes.post("/cart", isAuth, shopController.postCartProduct);
routes.post(
  "/delete-product/:productId",
  isAuth,
  shopController.postDeleteProduct
);
routes.get("/checkout", isAuth, shopController.getCheckoutProdcuts);
routes.get("/checkout/success", shopController.getCheckoutSuccess);
routes.get("/checkout/cancle", shopController.getCheckoutProdcuts);
routes.get("/orders", isAuth, shopController.getOrderedProdcuts);
routes.post("/delete-order/:orderId", isAuth, shopController.postDeleteOrder);
routes.post("/invoice-order/:orderId", isAuth, shopController.postGetInvoice);
module.exports = routes;
