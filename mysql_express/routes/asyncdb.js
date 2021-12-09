var mysql2 = require("mysql2/promise");
require("dotenv").config("../../.env");

const conn2 = mysql2.createPool({
  host: `${process.env.DB_HOST}`,
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASS}`,
  database: `${process.env.DB_NAME}`,
});

module.exports = conn2;
