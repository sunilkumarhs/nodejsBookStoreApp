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
  // req.user
  //   .createProduct({
  //     title: productTitle,
  //     price: price,
  //     description: description,
  //     imgUrl: imgUrl,
  //   })
  //   .then(() => res.redirect("/admin/products"))
  //   .catch((err) => console.log(err));
  const product = new ProductModel(
    productTitle,
    price,
    description,
    imgUrl,
    req.user._id
  );
  product
    .save()
    .then(() => {
      console.log("product creted");
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
  ProductModel.fetchById(prdId)
    .then((product) => {
      if (!product) {
        res.redirect("/");
      }
      res.render("admin/add-product", {
        docTitle: "Edit-Product Page",
        heading: "Edit Details of Book",
        buttonWord: "SAVE BOOK",
        path: "/admin/edit-product",
        product: product,
        editProduct: editMode,
      });
    })
    .catch((err) => console.log(err));
  // req.user
  //   .getProducts({ where: { id: prdId } })
  //   .then((products) => {
  //     const product = products[0];
  //     if (!product) {
  //       res.redirect("/");
  //     }
  //     res.render("admin/add-product", {
  //       docTitle: "Edit-Product Page",
  //       heading: "Edit Details of Book",
  //       buttonWord: "SAVE BOOK",
  //       path: "/admin/edit-product",
  //       product: product,
  //       editProduct: editMode,
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.getPostEditProduct = (req, res, next) => {
  const prdId = req.params.productId;
  const productTitle = req.body.productTitle;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new ProductModel(productTitle, price, description, imgUrl);
  product
    .update(prdId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
  // ProductModel.update(
  //   {
  //     title: productTitle,
  //     price: price,
  //     description: description,
  //     imgUrl: imgUrl,
  //   },
  //   { where: { id: prdId } }
  // )
  //   .then(() => res.redirect("/admin/products"))
  //   .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // req.user
  //   .getProducts()
  //   .then((products) =>
  //     res.render("admin/products", {
  //       prds: products,
  //       docTitle: "Admin-Products Page",
  //       path: "/admin/products",
  //     })
  //   )
  //   .catch((err) => console.log(err));
  ProductModel.fetchAll()
    .then((products) =>
      res.render("admin/products", {
        prds: products,
        docTitle: "Admin-Products Page",
        path: "/admin/products",
      })
    )
    .catch((err) => console.log(err));
};

exports.getDeleteCompleted = (req, res, next) => {
  const prdId = req.params.productId;
  ProductModel.delete(prdId)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
  // ProductModel.destroy({ where: { id: prdId } })
  //   .then(() => res.redirect("/admin/products"))
  //   .catch((err) => console.log(err));
};
