const db = require("../../utils/database");

module.exports = class ProductStore {
  constructor(title, imgUrl, price, description) {
    this.title = title;
    this.imgUrl = imgUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title,price,description,imgUrl) VALUES(?,?,?,?)",
      [this.title, this.price, this.description, this.imgUrl]
    );
  }

  static getProducts() {
    return db.execute("SELECT * FROM products");
  }

  static getProductById(prdId) {
    return db.execute(`SELECT * FROM products WHERE id=${prdId}`);
  }
  updateProduct(prdId) {
    return db.execute(
      "UPDATE products SET title=?,price=?,description=?,imgUrl=? WHERE id=?",
      [this.title, this.price, this.description, this.imgUrl, prdId]
    );
  }

  static deleteProduct(prdId) {
    return db.execute(`DELETE FROM products WHERE id=${prdId}`);
  }
};
