import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'resumai_db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // Support custom port
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: {
      rejectUnauthorized: false
  }
});

// Test connection on startup
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Database connection failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('   Hint: Check if MySQL is running and accessible at ' + (process.env.DB_HOST || 'localhost') + ':' + (process.env.DB_PORT || 3306));
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('   Hint: Check your DB_USER and DB_PASSWORD in .env file');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('   Hint: Database "' + (process.env.DB_NAME || 'resumai_db') + '" does not exist. Run "node scripts/init-db.js" to create it.');
        }
    });

export default pool;
