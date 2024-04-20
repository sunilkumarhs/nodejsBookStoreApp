const { UPSERT } = require("sequelize/lib/query-types");
const { getDb } = require("../../utils/database");
const mongoDb = require("mongodb");

class Product {
  constructor(title, price, description, imgUrl, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imgUrl = imgUrl;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }

  static fetchById(id) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongoDb.ObjectId(id) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  }
  update(id) {
    const db = getDb();
    return db
      .collection("products")
      .updateOne({ _id: new mongoDb.ObjectId(id) }, { $set: this })
      .then((result) => console.log("Book Updated"))
      .catch((err) => console.log(err));
  }
  static delete(id) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongoDb.ObjectId(id) })
      .then((result) => console.log("Book Deleted"))
      .catch((err) => console.log(err));
  }
}

// const Sequelize = require("sequelize");
// const sequelize = require("../../utils/database");

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.TEXT,
//     allowNull: false,
//   },
//   imgUrl: Sequelize.STRING,
// });

module.exports = Product;
