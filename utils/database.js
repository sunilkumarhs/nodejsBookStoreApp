const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-book-store", "root", "Puppet@1718", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

// const mysql = require("mysql2");
// const pool = mysql.createPool({
//   user: "root",
//   host: "localhost",
//   database: "node-book-store",
//   password: "Puppet@1718",
// });

// module.exports = pool.promise();
