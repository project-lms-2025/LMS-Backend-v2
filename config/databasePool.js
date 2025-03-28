import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your application's needs
  queueLimit: 0, // No limit on queued requests
});

pool.on('connection', () => {
  console.log('New connection established in the pool');
});

pool.on('release', () => {
  console.log('Connection released back to the pool');
});

export default pool;