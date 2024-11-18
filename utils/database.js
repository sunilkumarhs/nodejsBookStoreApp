const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.NODE_APP_MONGODB_URI_KEY);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const dotenv = require("dotenv");

// dotenv.config();

// let _db;
// const mongoConnect = (callback) => {
//   MongoClient.connect(process.env.NODE_APP_MONGODB_URI_KEY)
//     .then((client) => {
//       console.log("connected");
//       _db = client.db();
//       callback();
//     })
//     .catch((err) => {
//       console.log(err);
//       throw err;
//     });
// };

// const getDb = () => {
//   if (_db) {
//     return _db;
//   } else {
//     throw "No Database found!";
//   }
// };

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;

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
