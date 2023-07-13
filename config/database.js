require("dotenv").config();
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: `bookjam-backend-database.cktuh5mlbmvv.ap-northeast-2.rds.amazonaws.com`,
  user: `admin`,
  port: `3306`,
  password: `bookjam1`,
  database: `bookjam`,
});

export default pool;