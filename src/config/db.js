const { Pool } = require("pg");

module.exports = new Pool({
  user: "postgres",
  password: "@postgres#123!",
  host: "localhost",
  port: 5432,
  database: "gym_manager",
});
