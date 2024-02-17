const Sequelize = require("sequelize");

const sequelize = new Sequelize(
 "chatapp_fullstack",
 "root",
 "Soumya*123",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = sequelize;
