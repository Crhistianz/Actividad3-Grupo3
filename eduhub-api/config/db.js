import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "KasperskY7",
  database: "EduhubUltimo",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
