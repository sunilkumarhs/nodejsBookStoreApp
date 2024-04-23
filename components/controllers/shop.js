const ProductModel = require("../models/product");
const mongoDb = require("mongodb");
const User = require("../models/user");
// const CartModel = require("../models/cart");
// const Product = require("../models/product");
// const { where } = require("sequelize");
const Order = require("../models/orders");

exports.getIndex = (req, res, next) => {
  ProductModel.find()
    .then((products) =>
      res.render("shop/index", {
        prds: products,
        docTitle: "Index Page",
        path: "/",
      })
    )
    .catch((err) => console.log(err));
};

exports.getDisplayProducts = (req, res, next) => {
  ProductModel.find()
    .then((products) =>
      res.render("shop/product-list", {
        prds: products,
        docTitle: "Book-List Page",
        path: "/products",
      })
    )
    .catch((err) => console.log(err));
};

exports.getProductDetail = (req, res, next) => {
  const prdId = req.params.productId;
  // ProductModel.findByPk(prdId)
  //   .then((product) =>
  //     res.render("shop/product-detail", {
  //       product: product,
  //       docTitle: "Book Details",
  //     })
  //   )
  //   .catch((err) => console.log(err));
  ProductModel.findById(prdId)
    .then((product) =>
      res.render("shop/product-detail", {
        product: product,
        docTitle: "Book Details",
      })
    )
    .catch((err) => console.log(err));
};

exports.getCartProdcuts = async (req, res, next) => {
  const cart = req.user.cart.items;
  const cartItems = [];
  for (item in cart) {
    const product = await ProductModel.findById(cart[item].productId);
    cartItems.push({ product: product, quantity: cart[item].quantity });
  }
  res.render("shop/cart", {
    docTitle: "Your Cart",
    cartProducts: cartItems,
    path: "/cart",
  });

  // ProductModel.getProducts((products) => {
  //   CartModel.getCartPrds((cartPrds) => {
  //     const cartProducts = products?.reduce((cart, prd) => {
  //       cartPrds?.products?.map((p) => {
  //         if (p.id === prd.id) {
  //           cart.push(prd);
  //         }
  //       });
  //       return cart;
  //     }, []);
  //     res.render("shop/cart", {
  //       docTitle: "Your Cart",
  //       cartProducts: cartProducts,
  //       cartPrds: cartPrds,
  //       path: "/cart",
  //     });
  //   });
  // });
};

exports.postCartProduct = (req, res, next) => {
  const prdId = req.body.productId;
  // User.find({ _id: req.user._id }).then((user) => )
  let newQuantity = 1;
  let updatedCartItems = [...req.user.cart.items];
  const cartProductIndex = req.user.cart.items.findIndex((cp) => {
    return cp.productId.toString() === prdId;
  });
  if (cartProductIndex >= 0) {
    newQuantity = req.user.cart.items[cartProductIndex].quantity += 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: prdId,
      quantity: newQuantity,
    });
  }
  User.updateOne(
    { _id: req.user._id },
    { $set: { cart: { items: updatedCartItems } } }
  )
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  // ProductModel.fetchById(prdId)
  //   .then((product) => {
  //     return req.user.addToCart(product);
  //   })
  //   .then((result) => res.redirect("/cart"))
  //   .catch((err) => console.log(err));
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prdId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(prdId);
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
  // ProductModel.getProductById(prdId, (product) => {
  //   CartModel.cartProducer(prdId, product.price);
  // });
  // res.redirect("/cart");
};

exports.postDeleteProduct = (req, res, next) => {
  const prdId = req.params.productId;
  // req.user
  //   .removeCartItem(prdId)
  //   .then((result) => res.redirect("/cart"))
  //   .catch((err) => console.log(err));
  const cartProductItems = req.user.cart.items.filter((cp) => {
    return cp.productId.toString() !== prdId;
  });
  User.updateOne(
    { _id: req.user._id },
    { $set: { cart: { items: cartProductItems } } }
  )
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prdId } });
  //   })
  //   .then((product) => {
  //     fetchedCart.removeProduct(product, { where: { id: prdId } });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
  // const prdPrice = req.params.productPrice;
  // CartModel.deleteCartProduct(prdId, prdPrice);
  // res.redirect("/cart");
};

exports.postOrderProducts = async (req, res, next) => {
  const cart = req.user.cart.items;
  const cartItems = [];
  for (item in cart) {
    const product = await ProductModel.findById(cart[item].productId);
    cartItems.push({ product: product, quantity: cart[item].quantity });
  }
  const order = new Order({ userId: req.user._id, items: cartItems });

  order
    .save()
    .then(() => {
      return User.updateOne(
        { _id: req.user._id },
        { $set: { cart: { items: [] } } }
      );
    })
    .then((result) => res.redirect("/orders"))
    .catch((err) => console.log(err));
  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     return req.user.createOrder().then((order) => {
  //       return order.addProduct(
  //         products.map((product) => {
  //           product.orderItem = { quantity: product.cartItem.quantity };
  //           return product;
  //         })
  //       );
  //     });
  //   })
  //   .then((result) => {
  //     return fetchedCart.setProducts(null);
  //   })
  //   .then(() => {
  //     res.redirect("/orders");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getOrderedProdcuts = async (req, res, next) => {
  const orders = await Order.find({ userId: req.user._id });
  res.render("shop/orders", {
    docTitle: "Your Orders",
    orderDetails: orders,
    path: "/orders",
  });
  // req.user
  //   .getOrders({ include: ["products"] })
  //   .then((orders) => {
  //     res.render("shop/orders", {
  //       docTitle: "Your Orders",
  //       orderProducts: orders,
  //       path: "/orders",
  //     });
  //   })
  //   .catch((err) => console.log(err));
  // req.user
  //   .getOrder()
  //   .then((order) => {
  //     return order.getProducts().then((products) => {
  //       console.log(products);
  //       res.render("shop/orders", {
  //         docTitle: "Your Orders",
  //         orderProducts: products,
  //         path: "/orders",
  //       });
  //     });
  // })
};

exports.postDeleteOrder = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.deleteOne({ _id: new mongoDb.ObjectId(orderId) })
    .then((result) => res.redirect("/orders"))
    .catch((err) => console.log(err));
  // req.user
  //   .getOrders({ include: ["products"] })
  //   .then((orders) => {
  //     return orders.find((order) => order.dataValues.id == orderId);
  //   })
  //   .then((order) => {
  //     order.products.map((product) => {
  //       order.removeProduct(product, { where: { id: product.id } });
  //     });
  //     Order.destroy({ where: { id: order.id } });
  //   })
  //   .then(() => {
  //     res.redirect("/orders");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

// exports.getCheckoutProdcuts = (req, res, next) => {
//   res.render("shop/checkout", {
//     docTitle: "Your Checkout",
//     path: "/checkout",
//   });
// };
