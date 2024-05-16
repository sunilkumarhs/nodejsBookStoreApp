const ProductModel = require("../models/product");
const mongoDb = require("mongodb");
const User = require("../models/user");
// const CartModel = require("../models/cart");
// const Product = require("../models/product");
// const { where } = require("sequelize");
const Order = require("../models/orders");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const nodeMailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.NODE_APP_STRIPE_API);

const ITEMS_PER_PAGE = 2;

const transporter = nodeMailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.NODE_APP_SENDGRID_API,
    },
  })
);

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalPrds;
  ProductModel.find()
    .countDocuments()
    .then((numPrds) => {
      totalPrds = numPrds;
      return ProductModel.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prds: products,
        docTitle: "Index Page",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
        totalPrds: totalPrds,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalPrds,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalPrds / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getDisplayProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalPrds;
  ProductModel.find()
    .countDocuments()
    .then((numPrds) => {
      totalPrds = numPrds;
      return ProductModel.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prds: products,
        docTitle: "Book-List Page",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
        totalPrds: totalPrds,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalPrds,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalPrds / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
        isAuthenticated: req.session.isLoggedIn,
      })
    )
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    isAuthenticated: req.session.isLoggedIn,
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
  // req.user.cart.items = updatedCartItems;
  User.updateOne(
    { _id: req.user._id },
    { $set: { cart: { items: updatedCartItems } } }
  )
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
  console.log(prdId);
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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

// exports.postOrderProducts = async (req, res, next) => {
//   const cart = req.user.cart.items;
//   const cartItems = [];
//   for (item in cart) {
//     const product = await ProductModel.findById(cart[item].productId);
//     cartItems.push({ product: product, quantity: cart[item].quantity });
//   }
//   const order = new Order({ userId: req.user._id, products: cartItems });

//   order
//     .save()
//     .then(() => {
//       return User.updateOne(
//         { _id: req.user._id },
//         { $set: { cart: { items: [] } } }
//       );
//     })
//     .then((result) => res.redirect("/orders"))
//     .catch((err) => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
//   let fetchedCart;
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.user.createOrder().then((order) => {
//         return order.addProduct(
//           products.map((product) => {
//             product.orderItem = { quantity: product.cartItem.quantity };
//             return product;
//           })
//         );
//       });
//     })
//     .then((result) => {
//       return fetchedCart.setProducts(null);
//     })
//     .then(() => {
//       res.redirect("/orders");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

exports.getOrderedProdcuts = async (req, res, next) => {
  const orders = await Order.find({ userId: req.user._id });
  res.render("shop/orders", {
    docTitle: "Your Orders",
    orderDetails: orders,
    path: "/orders",
    isAuthenticated: req.session.isLoggedIn,
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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

exports.postGetInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No-Order Found!!"));
      }
      if (order.userId.toString() !== req.user._id.toString()) {
        return next(new Error("UnAuthorized Access!!"));
      }
      const invoiceId = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceId);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="` + invoiceId + `"`
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(24).text("Invoice");
      pdfDoc.fontSize(18).text("Order# : " + orderId);
      pdfDoc.text("------------------------------");
      let totalAmount = 0;
      order.products.forEach((prd) => {
        totalAmount += prd.quantity * prd.product.price;
        pdfDoc
          .fontSize(12)
          .text(
            prd.product.title +
              " - " +
              prd.quantity +
              " * " +
              prd.product.price +
              " = " +
              prd.quantity * prd.product.price +
              ".Rs"
          );
        pdfDoc.text("  ");
      });
      pdfDoc.text("---------------------");
      pdfDoc.fontSize(20).text("Total-Amount : " + totalAmount + ".Rs");
      pdfDoc.text("#######################################");
      pdfDoc.fontSize(10).text("Thankyou for Ordering from Book Store!");
      pdfDoc.end();

      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     `inline; filename="` + invoiceId + `"`
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   `inline; filename="` + invoiceId + `"`
      // );
      // file.pipe(res);
    })
    .catch((err) => next(err));
};

exports.getCheckoutProdcuts = async (req, res, next) => {
  const cart = req.user.cart.items;
  const cartItems = [];
  for (item in cart) {
    const product = await ProductModel.findById(cart[item].productId);
    cartItems.push({ product: product, quantity: cart[item].quantity });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: cartItems.map((p) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: p.product.title,
            description: p.product.description,
          },
          unit_amount: p.product.price * 100,
        },
        quantity: p.quantity,
      };
    }),
    success_url:
      req.protocol +
      "://" +
      req.get("host") +
      "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancle",
  });

  res.render("shop/checkout", {
    docTitle: "Checkout",
    checkoutItems: cartItems,
    path: "/checkout",
    sessionId: session.id,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getCheckoutCancle = (req, res, next) => {
  transporter.sendMail({
    to: email,
    from: "puppetmaster010420@gmail.com",
    subject: "Payment Cancled!",
    html: "<h1>Your payment is cancled due to error in payments!</h1>",
  });
  res.redirect("/checkout");
};

exports.getCheckoutSuccess = async (req, res, next) => {
  const session_id = req.query.session_id;
  if (session_id) {
    // const session = await stripe.checkout.sessions.retrieve(
    //   req.query.session_id
    // );
    const cart = req.user.cart.items;
    const cartItems = [];
    for (item in cart) {
      const product = await ProductModel.findById(cart[item].productId);
      cartItems.push({ product: product, quantity: cart[item].quantity });
    }
    const order = new Order({ userId: req.user._id, products: cartItems });

    order
      .save()
      .then(() => {
        return User.updateOne(
          { _id: req.user._id },
          { $set: { cart: { items: [] } } }
        );
      })
      .then((result) => {
        const email = req.user.email;
        res.redirect("/orders");
        return transporter.sendMail({
          to: email,
          from: "puppetmaster010420@gmail.com",
          subject: "Successfull Payment!",
          html: "<h1>Your payment is successfull!</h1>",
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else {
    res.redirect("/400");
  }
};

