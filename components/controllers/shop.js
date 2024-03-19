const ProductModel = require("../models/product");

exports.getIndex = (req, res, next) => {
  ProductModel.getProducts((products) => {
    res.render("shop/index", {
      prds: products,
      docTitle: "Index Page",
      path: "/",
    });
  });
};

exports.getDisplayProducts = (req, res, next) => {
  ProductModel.getProducts((products) => {
    res.render("shop/product-list", {
      prds: products,
      docTitle: "Book-List Page",
      path: "/products",
    });
  });
};

exports.getProductDetail = (req, res, next) => {
  const prdId = req.params.productId;
  ProductModel.getProductById(prdId, (prd) => {
    res.render("shop/product-detail", {
      product: prd,
      docTitle: "Book Details",
    });
  });
};

exports.getCartProdcuts = (req, res, next) => {
  res.render("shop/cart", {
    docTitle: "Your Cart",
    path: "/cart",
  });
};

exports.postCartProduct = (req, res, next) => {
  const prdId = req.body.productId;
  console.log(prdId);
  res.redirect("/");
};

exports.getOrderedProdcuts = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Your Orders",
    path: "/orders",
  });
};

exports.getCheckoutProdcuts = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Your Checkout",
    path: "/checkout",
  });
};
