import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "8.209.218.246",
  port: 2933,
  user: "leey",
  password: "5461150",
  database: "app_db",
});

export default pool;
