# Trae MySQL Integration Guide

## 1. Environment Setup

### Install Dependencies
Run in Trae terminal:
```bash
npm install mysql2 bcrypt jsonwebtoken dotenv cors express
```

### Database Configuration
1. Create a `.env` file in the root directory (copy from `.env.example`).
2. Update the values to match your MySQL environment.

**For Local MySQL (if running on your machine):**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=resumai_db
```

**For Remote MySQL:**
Replace `localhost` with the remote IP address.

## 2. Database Initialization

Run this command to automatically create the database, tables, and admin user:
```bash
node scripts/init-db.js
```

**What this does:**
- Creates database `resumai_db` if not exists
- Creates table `users` (id, username, password, role)
- Creates table `usage_logs` (id, user_id, action, timestamp)
- Creates default admin: `admin` / `Admin123!`

## 3. Start Application

### Start Backend
```bash
node server.js
```
*Look for "✅ Database connected successfully" in the logs.*

### Start Frontend
Open a **new terminal** and run:
```bash
npm run dev
```

## 4. Testing Workflow

### Step 1: Register User
1. Go to `http://localhost:5173/login`
2. Toggle to "Register" mode
3. Enter username `testuser` and password `password123`
4. Click Register -> Should see "Success" message

### Step 2: Login & Use
1. Login with `testuser` / `password123`
2. You will be redirected to Home
3. Enter some text in the resume optimizer and click "AI Optimize"
4. This action will log an entry to the database

### Step 3: Admin Check
1. Logout (click user icon in header)
2. Login as `admin` / `Admin123!`
3. Click "管理后台" in the header
4. Verify that `testuser` appears in the list and usage count has increased

## 5. Debugging in Trae

### Check Database Content
You can write a simple script to check data without external tools.
Create file `scripts/check-data.js`:

```javascript
const pool = require('../db');

async function check() {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    console.log('--- Users ---');
    console.table(users);

    const [logs] = await pool.query('SELECT * FROM usage_logs');
    console.log('\n--- Logs ---');
    console.table(logs);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

check();
```

Run it:
```bash
node scripts/check-data.js
```
