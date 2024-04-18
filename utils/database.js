const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://puppet1718:Puppet010420@cluster010420.tdgtki9.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster010420"
  )
    .then((client) => {
      console.log("connected");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw "No Database found!";
  }
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

// "mongodb+srv://sunilkumarhs974117:Puppet010420@cluster1718.401mz4b.mongodb.net/test?retryWrites=true"

// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("node-book-store", "root", "Puppet@1718", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;

// const mysql = require("mysql2");
// const pool = mysql.createPool({
//   user: "root",
//   host: "localhost",
//   database: "node-book-store",
//   password: "Puppet@1718",
// });

// module.exports = pool.promise();
