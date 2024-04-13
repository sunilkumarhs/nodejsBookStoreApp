const { Json } = require("sequelize/lib/utils");
const ProductModel = require("../models/product");
const { where } = require("sequelize");

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
  ProductModel.create({
    title: productTitle,
    price: price,
    description: description,
    imgUrl: imgUrl,
  })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
  // const product = new ProductModel(productTitle, imgUrl, price, description);
  // product
  //   .save()
  //   .then(() => {
  //     res.redirect("/admin/products");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/admin/products");
  }
  const prdId = req.params.productId;
  ProductModel.findByPk(prdId)
    .then((product) =>
      res.render("admin/add-product", {
        docTitle: "Edit-Product Page",
        heading: "Edit Details of Book",
        buttonWord: "SAVE BOOK",
        path: "/admin/edit-product",
        product: product,
        editProduct: editMode,
      })
    )
    .catch((err) => console.log(err));
};

exports.getPostEditProduct = (req, res, next) => {
  const prdId = req.params.productId;
  const productTitle = req.body.productTitle;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;
  ProductModel.update(
    {
      title: productTitle,
      price: price,
      description: description,
      imgUrl: imgUrl,
    },
    { where: { id: prdId } }
  )
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  ProductModel.findAll()
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
  ProductModel.destroy({ where: { id: prdId } })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};
