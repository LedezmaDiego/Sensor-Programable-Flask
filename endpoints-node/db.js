// npm install mysql2
// npm install dotenv
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno desde el archivo .env

// Configuracion de la conexion
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
