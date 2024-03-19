const ProductModel = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add-Products Page",
    path: "/admin/add-product",
  });
};

exports.getPostProduct = (req, res, next) => {
  const productTitle = req.body.productTitle;
  const imageurl = req.body.imageurl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new ProductModel(productTitle, imageurl, price, description);
  product.save();
  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  ProductModel.getProducts((products) => {
    res.render("admin/products", {
      prds: products,
      docTitle: "Admin-Products Page",
      path: "/admin/products",
    });
  });
};
