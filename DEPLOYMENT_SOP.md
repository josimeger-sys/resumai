# ResumAi 全栈项目部署与运维标准作业程序 (SOP)

**版本**: 1.0  
**生效日期**: 2026-02-19  
**适用范围**: ResumAi 项目的开发、部署与日常运维。

---

## 1. 目的
规范 ResumAi 项目的部署流程、环境配置及故障处理机制，确保前后端服务（React + Node.js + MySQL）的稳定性与可维护性。

## 2. 系统架构
- **前端**: React (Vite) -> 托管于 **Vercel**
- **后端**: Node.js (Express) -> 托管于 **Vercel Serverless Functions** (通过 `/api` 路由)
- **数据库**: MySQL (支持 SSL 连接) -> 托管于云数据库 (如 TiDB/PlanetScale/RDS)
- **代码仓库**: GitHub

---

## 3. 角色与职责
- **开发人员**: 负责代码提交、本地测试及编写部署文档。
- **运维/管理员**: 负责生产环境配置、数据库管理、日志监控及故障排查。

---

## 4. 部署前准备 (Pre-deployment)

### 4.1 数据库准备
1.  **获取连接信息**: 确保拥有远程 MySQL 数据库的 `Host`, `Port`, `User`, `Password`, `Database Name`。
2.  **SSL 配置**: 确认数据库支持 SSL 连接（本项目已强制开启 `rejectUnauthorized: false`）。
3.  **表结构初始化**:
    - 连接数据库。
    - 执行 `scripts/init-db.js` 中的 SQL 语句创建 `users` 和 `usage_logs` 表。
    - 验证表是否存在。

### 4.2 环境变量清单
在部署平台（Vercel）需配置以下环境变量：

| 变量名 | 描述 | 示例值 |
| :--- | :--- | :--- |
| `DB_HOST` | 数据库地址 | `gateway01...aws.tidbcloud.com` |
| `DB_PORT` | 数据库端口 | `4000` 或 `3306` |
| `DB_USER` | 数据库用户 | `root` |
| `DB_PASSWORD` | 数据库密码 | `******` |
| `DB_NAME` | 数据库名 | `resumai_db` |
| `JWT_SECRET` | JWT 签名密钥 | (生成随机长字符串) |
| `VITE_OPENAI_API_KEY` | AI 服务密钥 | `sk-xxxxxx` |
| `VITE_OPENAI_BASE_URL` | AI 服务地址 | `https://api.deepseek.com` |
| `VITE_OPENAI_MODEL` | AI 模型名称 | `deepseek-chat` |

---

## 5. 部署流程 (Deployment)

### 5.1 代码提交
1.  在本地确认代码无误，且 `npm run dev` 运行正常。
2.  提交代码到 `main` 或 `master` 分支：
    ```bash
    git add .
    git commit -m "feat: description of changes"
    git push origin main
    ```

### 5.2 Vercel 自动部署
1.  代码推送到 GitHub 后，Vercel 会自动触发构建。
2.  **构建检查**:
    - 登录 Vercel 控制台。
    - 查看 "Deployments" 状态。
    - 确保 "Status" 为 `Ready` (绿色)。
3.  **后端 API 验证**:
    - 访问 `https://your-project.vercel.app/api/health`。
    - **预期结果**: `{"status":"ok","db":"connected"}`。
    - **异常处理**: 若返回 `disconnected`，检查 Vercel 环境变量中的数据库配置。

### 5.3 数据库验证
1.  访问前端页面。
2.  尝试**注册**新用户。
3.  尝试**管理员登录** (点击右上角盾牌图标)。
    - 测试账号: `18800199049`
    - 测试密码: `18800199049Hsy`

---

## 6. 管理员操作规范

### 6.1 进入管理后台
1.  访问首页。
2.  点击右上角 **盾牌图标** (🛡️)。
3.  输入管理员账号密码。
4.  登录成功后，点击出现的 **"管理后台"** 按钮。
5.  **二次验证**: 进入后台页面时需再次输入密码确认。

### 6.2 账号管理
- **修改管理员密码**:
  需直接操作数据库（未来可开发前端功能）：
  ```sql
  -- 生成新密码的 Hash 值后执行：
  UPDATE users SET password = 'NEW_HASHED_PASSWORD' WHERE username = '18800199049';
  ```
- **查看用户统计**:
  在管理后台查看 "Total Users" 和 "Usage Trend"。

---

## 7. 常见故障排除 (Troubleshooting)

### 7.1 部署失败 (Build Failed)
- **现象**: Vercel 显示构建错误。
- **排查**: 查看 "Build Logs"。常见原因包括 TypeScript 类型错误、依赖包缺失。
- **对策**: 本地运行 `npm run build` 复现错误并修复。

### 7.2 API 405 Method Not Allowed
- **现象**: 请求 `/api/xxx` 返回 405。
- **原因**: 路由配置错误或 Serverless Function 未正确导出。
- **检查**:
    1.  确认 `vercel.json` 中 `rewrites` 指向 `/api/index.js`。
    2.  确认 `api/index.js` 正确导出了 `app`。
    3.  确认 `server.js` 使用了 `export default app`。

### 7.3 数据库连接失败
- **现象**: `/api/health` 返回 `disconnected` 或 500。
- **原因**:
    1.  IP 白名单限制（需在云数据库控制台放行 Vercel IP，或允许所有 IP）。
    2.  SSL 配置问题（本项目已启用 SSL，若数据库不支持 SSL 可能会报错）。
    3.  连接数超限（Serverless 环境下连接池可能瞬间耗尽）。
- **对策**: 检查 Vercel Function Logs，查看具体报错信息 (`ECONNREFUSED` 或 `Handshake failed`)。

---

## 8. 紧急回滚 (Rollback)
若新版本出现严重 Bug：
1.  登录 Vercel 控制台。
2.  进入 "Deployments" 列表。
3.  找到上一个稳定版本（Status 为 Ready）。
4.  点击右侧三个点 -> **"Redeploy"** 或 **"Promote to Production"**。
5.  验证回滚后的服务是否恢复。
