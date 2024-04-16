const ProductModel = require("../models/product");
const CartModel = require("../models/cart");
const Product = require("../models/product");
const { where } = require("sequelize");

exports.getIndex = (req, res, next) => {
  ProductModel.findAll()
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
  ProductModel.findAll()
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
  ProductModel.findByPk(prdId)
    .then((product) =>
      res.render("shop/product-detail", {
        product: product,
        docTitle: "Book Details",
      })
    )
    .catch((err) => console.log(err));
};

exports.getCartProdcuts = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts().then((products) => {
        res.render("shop/cart", {
          docTitle: "Your Cart",
          cartProducts: products,
          path: "/cart",
        });
      });
    })
    .catch((err) => console.log(err));
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
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prdId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prdId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  // ProductModel.getProductById(prdId, (product) => {
  //   CartModel.cartProducer(prdId, product.price);
  // });
  // res.redirect("/cart");
};

exports.postDeleteProduct = (req, res, next) => {
  const prdId = req.params.productId;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prdId } });
    })
    .then((product) => {
      fetchedCart.removeProduct(product, { where: { id: prdId } });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  // const prdPrice = req.params.productPrice;
  // CartModel.deleteCartProduct(prdId, prdPrice);
  // res.redirect("/cart");
};

exports.postOrderProducts = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user.createOrder().then((order) => {
        return order.addProduct(
          products.map((product) => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          })
        );
      });
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrderedProdcuts = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        docTitle: "Your Orders",
        orderProducts: orders,
        path: "/orders",
      });
    })
    .catch((err) => console.log(err));
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

exports.getCheckoutProdcuts = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Your Checkout",
    path: "/checkout",
  });
};
