const mongoDb = require("mongodb");
const { getDb } = require("../../utils/database");
const { where } = require("sequelize");

class User {
  constructor(userName, password, email, cart, id) {
    this.userName = userName;
    this.password = password;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => console.log("User Added"))
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const db = getDb();
    let newQuantity = 1;
    let updatedCartItems = [...this.cart.items];
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity += 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongoDb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = { items: updatedCartItems };
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static findUserById(id) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongoDb.ObjectId(id) })
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;

// const Sequelize = require("sequelize");

// const sequalize = require("../../utils/database");

// const User = sequalize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: Sequelize.STRING,
// });

// module.exports = User;
