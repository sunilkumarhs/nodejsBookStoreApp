const ProductModel = require("../models/product");
const CartModel = require("../models/cart");

exports.getIndex = (req, res, next) => {
  ProductModel.getProducts((products) => {
    res.render("shop/index", {
      prds: products,
      docTitle: "Index Page",
      path: "/",
    });
  });
};

exports.getDisplayProducts = (req, res, next) => {
  ProductModel.getProducts((products) => {
    res.render("shop/product-list", {
      prds: products,
      docTitle: "Book-List Page",
      path: "/products",
    });
  });
};

exports.getProductDetail = (req, res, next) => {
  const prdId = req.params.productId;
  ProductModel.getProductById(prdId, (prd) => {
    res.render("shop/product-detail", {
      product: prd,
      docTitle: "Book Details",
    });
  });
};

exports.getCartProdcuts = (req, res, next) => {
  ProductModel.getProducts((products) => {
    CartModel.getCartPrds((cartPrds) => {
      const cartProducts = products?.reduce((cart, prd) => {
        cartPrds?.products?.map((p) => {
          if (p.id === prd.id) {
            cart.push(prd);
          }
        });
        return cart;
      }, []);
      res.render("shop/cart", {
        docTitle: "Your Cart",
        cartProducts: cartProducts,
        cartPrds: cartPrds,
        path: "/cart",
      });
    });
  });
};

exports.postCartProduct = (req, res, next) => {
  const prdId = req.body.productId;
  ProductModel.getProductById(prdId, (product) => {
    CartModel.cartProducer(prdId, product.price);
  });
  res.redirect("/cart");
};

exports.postDeleteProduct = (req, res, next) => {
  const prdId = req.params.productId;
  const prdPrice = req.params.productPrice;
  CartModel.deleteCartProduct(prdId, prdPrice);
  res.redirect("/cart");
};

exports.getOrderedProdcuts = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Your Orders",
    path: "/orders",
  });
};

exports.getCheckoutProdcuts = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Your Checkout",
    path: "/checkout",
  });
};
