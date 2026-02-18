import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db.js'; // Note: using .js extension for ESM

const app = express();
const PORT = process.env.PORT || 3002; // Changed port to 3002 to avoid conflict
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH APIs ---

// 0. Test DB Connection
app.get('/api/health', async (req, res) => {
    console.log('Health check requested');
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', db: 'connected' });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ status: 'error', db: 'disconnected', error: error.message });
    }
});

// 1. Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Check if user exists
    const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const user = users[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    // Generate Token
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        isVip: false // Removed VIP logic, always false
      }
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({ success: false, message: 'Database connection failed. Please check server logs.' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 3. Get Current User (Me)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    res.json({ success: true, user: req.user });
});

// --- APP APIs ---

// 4. Report Usage
app.post('/api/report-usage', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetPosition } = req.body;
        
        await pool.query(
            'INSERT INTO usage_logs (user_id, action, target_position) VALUES (?, ?, ?)',
            [userId, 'optimize_resume', targetPosition || null]
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 5. Admin Dashboard Data
app.get('/api/admin/dashboard', authenticateToken, async (req, res) => {
    try {
        // Check admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // 1. Stats
        const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
        const [usageCount] = await pool.query('SELECT COUNT(*) as count FROM usage_logs');
        
        // 2. Trend Data (Last 7 days)
        const [trend] = await pool.query(`
            SELECT DATE_FORMAT(timestamp, '%Y-%m-%d') as date, COUNT(*) as count 
            FROM usage_logs 
            WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY date 
            ORDER BY date ASC
        `);

        // 3. User List (Top 20 active)
        const [users] = await pool.query(`
            SELECT u.id, u.username, u.role, COUNT(l.id) as usageCount 
            FROM users u 
            LEFT JOIN usage_logs l ON u.id = l.user_id 
            GROUP BY u.id 
            ORDER BY usageCount DESC 
            LIMIT 20
        `);

        // 4. Top Job Positions (New)
        const [topPositions] = await pool.query(`
            SELECT target_position, COUNT(*) as count 
            FROM usage_logs 
            WHERE target_position IS NOT NULL 
            GROUP BY target_position 
            ORDER BY count DESC 
            LIMIT 10
        `);

        res.json({
            success: true,
            stats: {
                totalUsers: userCount[0].count,
                totalUsage: usageCount[0].count,
                vipUsers: 0 // Not tracking VIPs
            },
            trend,
            users,
            topPositions
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 6. Admin Password Verify
app.post('/api/admin/verify', authenticateToken, async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ success: false });

        const user = users[0];
        if (user.role !== 'admin') return res.status(403).json({ success: false });

        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Export the app for Vercel Serverless
export default app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
}
