const express = require("express");
const adminController = require("../components/controllers/admin");
const isAuth = require("../middleware/is-auth");
const routes = express.Router();
const { check, body } = require("express-validator");

routes.get("/add-product", isAuth, adminController.getAddProduct);
routes.get("/products", isAuth, adminController.getProducts);
routes.post(
  "/add-product",
  [
    body("productTitle")
      .isLength({ min: 1 })
      .withMessage("Please enter the Title of Book!"),
    check("imgUrl")
      .isURL({
        protocols: ["http", "https", "ftp"],
        require_tld: true,
        require_protocol: true,
        require_host: true,
        require_port: false,
        require_valid_protocol: true,
        allow_underscores: false,
        host_whitelist: false,
        host_blacklist: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
        allow_fragments: true,
        allow_query_components: true,
        disallow_auth: false,
        validate_length: true,
      })
      .withMessage("Please enter the valid url of image!"),
    body("price").isNumeric().withMessage("Enter the proper price!"),
    body("description")
      .isLength({ min: 30 })
      .withMessage(
        "Please enter atleast 30 character of length of string as description!"
      ),
  ],
  isAuth,
  adminController.getPostProduct
);
routes.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
routes.post(
  "/edit-product/:productId",
  [
    body("userId").custom((value, { req }) => {
      if (value !== req.user._id.toString()) {
        return res.redirect("/admin/products");
      }
      return true;
    }),
    body("productTitle")
      .isLength({ min: 1 })
      .withMessage("Please enter the Title of Book!"),
    check("imgUrl")
      .isURL({
        protocols: ["http", "https", "ftp"],
        require_tld: true,
        require_protocol: true,
        require_host: true,
        require_port: false,
        require_valid_protocol: true,
        allow_underscores: false,
        host_whitelist: false,
        host_blacklist: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
        allow_fragments: true,
        allow_query_components: true,
        disallow_auth: false,
        validate_length: true,
      })
      .withMessage("Please enter the valid url of image!"),
    body("price").isNumeric().withMessage("Enter the proper price!"),
    body("description")
      .isLength({ min: 30 })
      .withMessage(
        "Please enter atleast 30 character of length of string as description!"
      ),
  ],
  isAuth,
  adminController.getPostEditProduct
);
routes.post(
  "/delete-product/:productId",
  isAuth,
  adminController.getDeleteCompleted
);

module.exports = routes;
