const mysql = require("mysql2");
const connection = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "iliveinruiru",
    database: "pilot"
  })
  .promise();
module.exports = connection;
