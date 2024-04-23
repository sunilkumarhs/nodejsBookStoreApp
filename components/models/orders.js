const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  items: [],
});

module.exports = mongoose.model("Order", orderSchema);

// const Sequelize = require("sequelize");
// const sequelize = require("../../utils/database");

// const Order = sequelize.define("order", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
// });

// module.exports = Order;
