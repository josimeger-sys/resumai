# 全栈部署指南 (MySQL + Node.js + React)

本指南将帮助你将本地开发的全栈应用部署到云端，使其可被公网访问。我们将使用 **Render** 托管数据库和后端，使用 **Vercel** 托管前端。

---

## 第一步：准备数据库 (MySQL on Render)

由于 Render 提供免费的 PostgreSQL 但 MySQL 需要付费，推荐使用 **TiDB Cloud (兼容 MySQL)** 或 **PlanetScale**，或者直接使用 **Render 的 PostgreSQL** (如果不介意切换数据库)。
*为了保持与当前代码兼容，我们假设你找到了一个 **远程 MySQL 数据库** (例如阿里云 RDS，或者免费的 TiDB Serverless)*。

**假设你已获得数据库连接信息：**
- **Host**: `gateway01.us-west-2.prod.aws.tidbcloud.com` (示例)
- **Port**: `4000`
- **User**: `your_user`
- **Password**: `your_password`
- **Database**: `resumai_db`

**初始化数据库：**
使用任何 SQL 客户端（如 DBeaver, Navicat 或 VS Code 插件）连接到远程数据库，并执行 `scripts/init-db.js` 中的 SQL 建表语句（或者直接运行该脚本，但需先修改本地 `.env` 为远程地址）。

---

## 第二步：部署后端 (Node.js on Render)

1.  **上传代码到 GitHub**
    - 确保你的项目已提交到 GitHub 仓库。
    - 确保根目录有 `package.json` 和 `server.js`。

2.  **在 Render 创建 Web Service**
    - 注册/登录 [Render.com](https://render.com)。
    - 点击 **New +** -> **Web Service**。
    - 连接你的 GitHub 仓库。

3.  **配置服务**
    - **Name**: `resumai-backend` (自定义)
    - **Region**: 选择离你最近的 (如 Singapore)
    - **Branch**: `main`
    - **Root Directory**: `.` (留空)
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`

4.  **设置环境变量 (Environment Variables)**
    点击 "Advanced" 或 "Environment" 标签页，添加以下变量：
    - `DB_HOST`: (你的远程数据库 Host)
    - `DB_PORT`: (你的远程数据库 Port)
    - `DB_USER`: (你的远程数据库 User)
    - `DB_PASSWORD`: (你的远程数据库 Password)
    - `DB_NAME`: `resumai_db`
    - `JWT_SECRET`: (生成一个复杂的随机字符串)
    - `PORT`: `10000` (Render 默认端口)

5.  **部署**
    - 点击 **Create Web Service**。
    - 等待部署完成，Render 会给你一个 URL，例如：`https://resumai-backend.onrender.com`。
    - **复制这个 URL**，下一步要用。

---

## 第三步：部署前端 (React on Vercel)

1.  **准备 Vercel 配置**
    在项目根目录创建 `vercel.json` 文件，内容如下：
    ```json
    {
      "rewrites": [
        {
          "source": "/api/(.*)",
          "destination": "https://resumai-backend.onrender.com/api/$1"
        },
        {
          "source": "/(.*)",
          "destination": "/index.html"
        }
      ]
    }
    ```
    **注意**：将 `https://resumai-backend.onrender.com` 替换为你第二步获得的真实后端 URL。

2.  **提交代码**
    - 将 `vercel.json` 提交并推送到 GitHub。

3.  **在 Vercel 创建项目**
    - 注册/登录 [Vercel.com](https://vercel.com)。
    - 点击 **Add New...** -> **Project**。
    - 导入你的 GitHub 仓库。

4.  **配置构建设置**
    - **Framework Preset**: Vite
    - **Root Directory**: `.`
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`

5.  **设置环境变量 (Environment Variables)**
    - `VITE_OPENAI_API_KEY`: (你的 DeepSeek/OpenAI API Key)
    - `VITE_OPENAI_BASE_URL`: `https://api.deepseek.com` (或对应地址)
    - `VITE_OPENAI_MODEL`: `deepseek-chat`

6.  **部署**
    - 点击 **Deploy**。
    - 等待构建完成，Vercel 会给你一个前端访问域名，例如：`https://resumai-frontend.vercel.app`。

---

## 第四步：最终验证

1.  访问 Vercel 生成的前端 URL。
2.  打开控制台 (F12) -> Network。
3.  尝试注册一个新账号。
    - 观察请求是否成功发往后端。
    - 观察数据是否写入了远程数据库。
4.  尝试登录管理员账号 (`18800199049` / `18800199049Hsy`)，进入管理后台查看数据。

**祝贺！你的全栈应用已成功上线！🚀**
