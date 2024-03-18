const ProductModel = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add-Products Page",
    path: "/admin/add-product",
  });
};

exports.getPostProduct = (req, res, next) => {
  const product = new ProductModel(req.body.productTitle);
  product.save();
  res.redirect("/");
};

exports.getDisplayProducts = (req, res, next) => {
  ProductModel.getProducts((products) => {
    res.render("shop", {
      prds: products,
      docTitle: "Book-List Page",
      path: "/",
    });
  });
};
