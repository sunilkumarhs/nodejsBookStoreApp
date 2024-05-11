const ProductModel = require("../models/product");
const mongoDb = require("mongodb");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add-Products Page",
    heading: "Add Details of Book",
    buttonWord: "ADD BOOK",
    path: "/admin/add-product",
    editProduct: false,
    errorMessage: req.flash("addProdcutError"),
    isAuthenticated: req.session.isLoggedIn,
    outPutData: { prdTitle: "", prdImgUrl: "", prdPrice: "", prdDesc: "" },
    validationErrors: [],
  });
};

exports.getPostProduct = (req, res, next) => {
  const productTitle = req.body.productTitle;
  const imgUrl = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!imgUrl) {
    return res.status(422).render("admin/add-product", {
      docTitle: "Add-Products Page",
      heading: "Add Details of Book",
      buttonWord: "ADD BOOK",
      path: "/admin/add-product",
      editProduct: false,
      errorMessage: "Attached file is not an image!!",
      isAuthenticated: req.session.isLoggedIn,
      outPutData: {
        prdTitle: productTitle,
        prdPrice: price,
        prdDesc: description,
      },
      validationErrors: [],
    });
  }
  const errors = validationResult(req);
  // req.user
  //   .createProduct({
  //     title: productTitle,
  //     price: price,
  //     description: description,
  //     imgUrl: imgUrl,
  //   })
  //   .then(() => res.redirect("/admin/products"))
  //   .catch((err) => console.log(err));
  // const product = new ProductModel(
  //   productTitle,
  //   price,
  //   description,
  //   imgUrl,
  //   req.user._id
  // );
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      docTitle: "Add-Products Page",
      heading: "Add Details of Book",
      buttonWord: "ADD BOOK",
      path: "/admin/add-product",
      editProduct: false,
      errorMessage: errors.array()[0].msg,
      isAuthenticated: req.session.isLoggedIn,
      outPutData: {
        prdTitle: productTitle,
        prdPrice: price,
        prdDesc: description,
      },
      validationErrors: errors.array(),
    });
  }
  const imageUrl = "/" + imgUrl.path;
  const product = new ProductModel({
    title: productTitle,
    price: price,
    description: description,
    imgUrl: imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then(() => {
      console.log("product creted");
      return res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/admin/products");
  }
  const prdId = req.params.productId;
  ProductModel.findById(prdId)
    .then((product) => {
      if (!product) {
        res.redirect("/");
      }
      res.render("admin/add-product", {
        docTitle: "Edit-Product Page",
        heading: "Edit Details of Book",
        buttonWord: "SAVE BOOK",
        path: "/admin/edit-product",
        outPutEData: {
          prdId: product._id,
          userId: product.userId,
          prdTitle: product.title,
          prdPrice: product.price,
          prdDesc: product.description,
        },
        errorMessage: req.flash("editProdcutError"),
        editProduct: editMode,
        isAuthenticated: req.session.isLoggedIn,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
  const imageUrl = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.body.userId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      docTitle: "Edit-Product Page",
      heading: "Edit Details of Book",
      buttonWord: "SAVE BOOK",
      path: "/admin/edit-product",
      outPutEData: {
        prdId: prdId,
        userId: userId,
        prdTitle: productTitle,
        prdImgUrl: imgUrl,
        prdPrice: price,
        prdDesc: description,
      },
      errorMessage: errors.array()[0].msg,
      editProduct: true,
      isAuthenticated: req.session.isLoggedIn,
      validationErrors: errors.array(),
    });
  }

  ProductModel.findById(prdId)
    .then((product) => {
      // throw new Error("dummy");
      if (!product) {
        res.redirect("/");
      }
      product.title = productTitle;
      product.price = price;
      product.description = description;
      if (imageUrl) {
        product.imgUrl = "/" + imageUrl.path;
      }
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
  ProductModel.find({ userId: req.user._id })
    .then((products) =>
      res.render("admin/products", {
        prds: products,
        docTitle: "Admin-Products Page",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      })
    )
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getDeleteCompleted = (req, res, next) => {
  const prdId = req.params.productId;
  const userId = req.body.userId;
  if (userId.toString() !== req.user._id.toString()) {
    console.log("not");
    return res.redirect("/admin/products");
  }
  ProductModel.deleteOne({ _id: new mongoDb.ObjectId(prdId) })
    .then(() => {
      User.find()
        .then((users) => {
          users.map((user) => {
            const cartProductItems = user.cart.items.filter((cp) => {
              return cp.productId.toString() !== prdId;
            });
            User.updateOne(
              { _id: user._id },
              { $set: { cart: { items: cartProductItems } } }
            )
              .then(() => console.log("updated"))
              .catch((err) => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
              });
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // User.fetchUsers()
  //   .then((users) => {
  //     for (item in users) {
  //       const user = new User(
  //         users[item].userName,
  //         users[item].password,
  //         users[item].email,
  //         users[item].cart,
  //         users[item]._id
  //       );
  //       user.removeCartItem(prdId);
  //     }
  //     return;
  //   })
  //   .then(() => {
  //     return ProductModel.delete(prdId);
  //   })
  //   .then(() => res.redirect("/admin/products"))
  //   .catch((err) => console.log(err));
  // ProductModel.destroy({ where: { id: prdId } })
  //   .then(() => res.redirect("/admin/products"))
  //   .catch((err) => console.log(err));
};
