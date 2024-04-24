const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);

// const mongoDb = require("mongodb");
// const { getDb } = require("../../utils/database");
// const { where } = require("sequelize");

// class User {
//   constructor(userName, password, email, cart, id) {
//     this.userName = userName;
//     this.password = password;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => console.log("User Added"))
//       .catch((err) => console.log(err));
//   }

//   async order(cartItems) {
//     const db = getDb();
//     const orderInfo = { userId: this._id, items: cartItems };
//     return db
//       .collection("orders")
//       .insertOne(orderInfo)
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongoDb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   addToCart(product) {
//     const db = getDb();
//     let newQuantity = 1;
//     let updatedCartItems = [...this.cart.items];
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity += 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongoDb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongoDb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   removeCartItem(id) {
//     const db = getDb();
//     const cartProductItems = this.cart.items.filter((cp) => {
//       return cp.productId.toString() !== id;
//     });
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongoDb.ObjectId(this._id) },
//         { $set: { cart: { items: cartProductItems } } }
//       );
//   }

//   removeOrder(id) {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .deleteOne({ _id: new mongoDb.ObjectId(id) })
//       .then((result) => console.log("Order deleted!"))
//       .catch((err) => console.log(err));
//   }

//   static fetchCart(id) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: id })
//       .then((user) => {
//         return user.cart.items;
//       })
//       .catch((err) => console.log(err));
//   }

//   static fetchOrder(id) {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ userId: id })
//       .toArray()
//       .then((orders) => {
//         return orders;
//       })
//       .catch((err) => console.log(err));
//   }

//   static findUserById(id) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongoDb.ObjectId(id) })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }
//   static fetchUsers() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .find()
//       .toArray()
//       .then((users) => {
//         return users;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;

// // const Sequelize = require("sequelize");

// // const sequalize = require("../../utils/database");

// // const User = sequalize.define("user", {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true,
// //   },
// //   name: {
// //     type: Sequelize.STRING,
// //     allowNull: false,
// //   },
// //   email: Sequelize.STRING,
// // });

// // module.exports = User;
