const ProductModel = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add-Products Page",
    heading: "Add Details of Book",
    buttonWord: "ADD BOOK",
    path: "/admin/add-product",
    editProduct: false,
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

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/admin/products");
  }
  const prdId = req.params.productId;
  ProductModel.getProductById(prdId, (prd) => {
    res.render("admin/add-product", {
      docTitle: "Edit-Product Page",
      heading: "Edit Details of Book",
      buttonWord: "SAVE BOOK",
      path: "/admin/edit-product",
      product: prd,
      editProduct: editMode,
    });
  });
};

exports.getPostEditProduct = (req, res, next) => {
  const prdId = req.params.productId;
  const productTitle = req.body.productTitle;
  const imageurl = req.body.imageurl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new ProductModel(productTitle, imageurl, price, description);
  product.updateProduct(prdId);
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

exports.getDeleteCompleted = (req, res, next) => {
  const prdId = req.params.productId;
  ProductModel.deleteProduct(prdId);
  res.redirect("/admin/products");
};
