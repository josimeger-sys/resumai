/// api/db-test.js
import mysql from 'mysql2/promise';

export default async (req, res) => {
  try {
    const dbConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: true }
    };

    const connection = await mysql.createConnection(dbConfig);
    await connection.ping();

    res.status(200).json({
      success: true,
      message: '数据库连接成功！'
    });

    await connection.end();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '数据库连接失败！',
      error: err.message
    });
  }
};