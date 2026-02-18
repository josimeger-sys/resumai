/// api/db-test.js
i// api/db-test.js - 完整可运行的 ES Module 版本
import mysql from 'mysql2/promise'; // 修复拼写错误：mport → import

export default async (req, res) => {
  // 1. 解决跨域问题（前端调用必加）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. 处理 OPTIONS 预检请求（前端 POST/PUT 等请求必加）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const dbConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 4000, // 补充 TiDB 默认端口，防止端口未配置
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: true } // TiDB 必需的 SSL 配置
    };

    const connection = await mysql.createConnection(dbConfig);
    await connection.ping(); // 测试数据库连接

    res.status(200).json({
      success: true,
      message: '数据库连接成功！',
      // 可选：返回部分配置信息，方便排查
      dbInfo: {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database
      }
    });

    await connection.end(); // 关闭连接
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '数据库连接失败！',
      error: err.message,
      // 友好提示不同错误类型，方便排查
      hint: err.code === 'ECONNREFUSED' ? '检查数据库地址/端口是否正确' :
            err.code === 'ER_ACCESS_DENIED_ERROR' ? '检查用户名/密码是否正确' :
            err.code === 'ER_BAD_DB_ERROR' ? '检查数据库名是否正确' : '其他错误'
    });
  }
};