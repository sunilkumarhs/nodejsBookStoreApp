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
  constructor(t) {
    this.title = t;
  }

  save() {
    getProductFile((prodcuts) => {
      prodcuts.push(this);
      fs.writeFile(p, JSON.stringify(prodcuts), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static getProducts(cb) {
    getProductFile(cb);
  }
};
