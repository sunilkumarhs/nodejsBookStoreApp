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
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new ProductModel(productTitle, imgUrl, price, description);
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/admin/products");
  }
  const prdId = req.params.productId;
  ProductModel.getProductById(prdId).then(([row, fieldData]) => {
    res.render("admin/add-product", {
      docTitle: "Edit-Product Page",
      heading: "Edit Details of Book",
      buttonWord: "SAVE BOOK",
      path: "/admin/edit-product",
      product: row,
      editProduct: editMode,
    });
  });
};

exports.getPostEditProduct = (req, res, next) => {
  const prdId = req.params.productId;
  const productTitle = req.body.productTitle;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new ProductModel(productTitle, imgUrl, price, description);
  product
    .updateProduct(prdId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  ProductModel.getProducts()
    .then(([rows, fieldData]) => {
      res.render("admin/products", {
        prds: rows,
        docTitle: "Admin-Products Page",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDeleteCompleted = (req, res, next) => {
  const prdId = req.params.productId;
  ProductModel.deleteProduct(prdId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
