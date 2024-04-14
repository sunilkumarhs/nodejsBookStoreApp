const fs = require("fs");
const path = require("path");
const dirPath = require("../../utils/path");

const p = path.join(dirPath, "data", "cart.json");

const updateCart = (id, prdPrice, cart, cb) => {
  fs.readFile(p, (err, filecontent) => {
    if (!err) {
      cart = JSON.parse(filecontent);
    }
    const existingProductIndex = cart.products.findIndex(
      (product) => product.id === id
    );
    const existingProduct = cart.products[existingProductIndex];
    let updatedProduct;
    if (existingProduct) {
      updatedProduct = { ...existingProduct };
      updatedProduct.qty = updatedProduct.qty + 1;
      cart.products = [...cart.products];
      cart.products[existingProductIndex] = updatedProduct;
    } else {
      updatedProduct = { id: id, qty: 1 };
      cart.products = [...cart.products, updatedProduct];
    }
    cart.totalPrice = cart.totalPrice + +prdPrice;
    return cb(cart);
  });
};

const getProducts = (cb) => {
  fs.readFile(p, (err, filecontent) => {
    if (err) {
      return cb({ products: [], totalPrice: 0 });
    }
    return cb(JSON.parse(filecontent));
  });
};

module.exports = class CartContainer {
  static cartProducer(id, prdPrice) {
    let cart = { products: [], totalPrice: 0 };
    updateCart(id, prdPrice, cart, (cartProducts) => {
      fs.writeFile(p, JSON.stringify(cartProducts), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }
  static getCartPrds(cb) {
    getProducts(cb);
  }
  static deleteCartProduct(prdId, prdPrice) {
    getProducts((cartProducts) => {
      const deleteProductIndex = cartProducts.products.findIndex(
        (p) => p.id === prdId
      );
      const reducePrice =
        cartProducts.products[deleteProductIndex].qty * prdPrice;
      cartProducts.products.splice(deleteProductIndex, 1);
      cartProducts.totalPrice = cartProducts.totalPrice - reducePrice;
      fs.writeFile(p, JSON.stringify(cartProducts), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }
};
