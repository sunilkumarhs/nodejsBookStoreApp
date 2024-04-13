const path = require("path");
const fs = require("fs");
const dirPath = require("../../utils/path");

const p = path.join(dirPath, "data", "products.json");

const getProductFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    return cb(JSON.parse(fileContent));
  });
};

module.exports = class ProductStore {
  constructor(title, imageurl, price, description) {
    this.title = title;
    this.imageurl = imageurl;
    this.price = price;
    this.description = description;
  }

  save() {
    this.id = Math.random().toString();
    getProductFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static getProducts(cb) {
    getProductFile(cb);
  }

  static getProductById(id, cb) {
    getProductFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
  updateProduct(id) {
    this.id = id;
    getProductFile((products) => {
      const productIndex = products.findIndex((p) => p.id === id);
      products[productIndex] = this;
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static deleteProduct(id) {
    getProductFile((products) => {
      const productIndex = products.findIndex((p) => p.id === id);
      products.splice(productIndex, 1);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }
};
