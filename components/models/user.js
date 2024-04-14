const Sequelize = require("sequelize");

const sequalize = require("../../utils/database");

const User = sequalize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: Sequelize.STRING,
});

module.exports = User;
