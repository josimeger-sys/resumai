import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';


dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 4000,
  ssl: {
    rejectUnauthorized: true
  }
};

const DB_NAME = process.env.DB_NAME || 'resumai_db';

async function initDB() {
  let connection;
  try {
    // 1. Connect to MySQL server (without database)
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL server.');

    // 2. Create Database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    console.log(`Database '${DB_NAME}' created or already exists.`);

    // 3. Use Database
    await connection.query(`USE ${DB_NAME}`);

    // 4. Create Users Table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createUsersTable);
    console.log('Table "users" checked/created.');

    // 5. Create Usage Logs Table
    const createLogsTable = `
      CREATE TABLE IF NOT EXISTS usage_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        action VARCHAR(255),
        target_position VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await connection.query(createLogsTable);
    console.log('Table "usage_logs" checked/created.');
    
    // Add column if not exists (for existing tables)
    try {
        await connection.query(`ALTER TABLE usage_logs ADD COLUMN target_position VARCHAR(255)`);
        console.log('Added column "target_position" to "usage_logs".');
    } catch (e) {
        // Ignore error if column already exists
        if (e.code !== 'ER_DUP_FIELDNAME') {
             console.log('Column "target_position" already exists or other error:', e.message);
        }
    }

    // 6. Create Admin User
    const adminUsername = '18800199049';
    const adminPassword = '18800199049Hsy';
    
    // Check if admin exists
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [adminUsername]);
    
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await connection.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [adminUsername, hashedPassword, 'admin']
      );
      console.log(`Admin user created: ${adminUsername} / ${adminPassword}`);
    } else {
      // If admin exists, update password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await connection.query(
        'UPDATE users SET password = ?, role = "admin" WHERE username = ?',
        [hashedPassword, adminUsername]
      );
      console.log(`Admin user updated: ${adminUsername} / ${adminPassword}`);
    }

  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    if (connection) await connection.end();
  }
}

initDB();
