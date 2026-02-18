# 项目部署指南 (Frontend + Backend)

## 1. 架构说明
本项目为前后端分离架构，需要分别部署前端和后端服务，并配置数据库。

- **前端 (React/Vite)**: 负责用户界面展示，调用后端 API。
- **后端 (Node.js/Express)**: 负责业务逻辑、API 接口、数据库连接。
- **数据库 (MySQL)**: 存储用户数据和日志。

## 2. 数据库部署 (MySQL)
你需要一个可以远程访问的 MySQL 数据库。

**选项 A: 云数据库 (推荐)**
- 使用 AWS RDS, Google Cloud SQL, 阿里云 RDS, 或 PlanetScale (兼容 MySQL) 等服务。
- 创建数据库 `resumai_db`。
- 获取连接信息: Host, Port, User, Password, Database Name。

**选项 B: 自建数据库**
- 在云服务器 (EC2/VPS) 上安装 MySQL。
- 确保防火墙开放 3306 端口 (或你设置的端口)。

**初始化数据表:**
连接到你的远程数据库，执行 `scripts/init-db.js` 中的 SQL 逻辑，或者手动运行以下 SQL:

```sql
CREATE DATABASE IF NOT EXISTS resumai_db;
USE resumai_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 3. 后端部署 (Node.js)
后端代码位于根目录 (`server.js` 等)。

**推荐平台: Render / Railway / Heroku / 云服务器**

以 **Render** 为例:
1. 将代码推送到 GitHub。
2. 在 Render 创建 **Web Service**。
3. 连接你的 GitHub 仓库。
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. **Environment Variables (环境变量)**:
   - `DB_HOST`: 你的远程数据库地址
   - `DB_USER`: 数据库用户名
   - `DB_PASSWORD`: 数据库密码
   - `DB_NAME`: `resumai_db`
   - `DB_PORT`: `3306` (或你的端口)
   - `JWT_SECRET`: 设置一个复杂的随机字符串
   - `PORT`: `10000` (Render 默认端口，或者是你设置的端口)

**部署完成后，你会获得一个后端 URL，例如: `https://my-backend.onrender.com`**

## 4. 前端部署 (Vite)
前端代码在 `src` 目录。

**推荐平台: Vercel / Netlify**

以 **Vercel** 为例:
1. 在项目根目录创建 `vercel.json` (如果不存在)，内容如下:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://YOUR-BACKEND-URL.com/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
   **注意**: 将 `https://YOUR-BACKEND-URL.com` 替换为第 3 步中获得的后端 URL。

2. 将代码推送到 GitHub。
3. 在 Vercel 导入项目。
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
   - `VITE_OPENAI_API_KEY`: 你的 AI API Key
   - `VITE_OPENAI_BASE_URL`: AI API Base URL (如 `https://api.deepseek.com`)
   - `VITE_OPENAI_MODEL`: AI 模型名称 (如 `deepseek-chat`)

## 5. 验证
访问 Vercel 生成的前端 URL，尝试注册和登录。如果一切正常，数据将写入你的远程 MySQL 数据库。
