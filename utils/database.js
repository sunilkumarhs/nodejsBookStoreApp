const mysql = require("mysql2");

const pool = mysql.createPool({
  user: "root",
  host: "localhost",
  database: "node-book-store",
  password: "Puppet@1718",
});

module.exports = pool.promise();
