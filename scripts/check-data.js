import pool from '../db.js';

async function check() {
  try {
    const [users] = await pool.query('SELECT id, username, role, created_at FROM users');
    console.log('--- Users ---');
    console.table(users);

    const [logs] = await pool.query('SELECT * FROM usage_logs ORDER BY id DESC LIMIT 10');
    console.log('\n--- Recent Logs (Last 10) ---');
    console.table(logs);
  } catch (e) {
    console.error(e);
  } finally {
    // pool.end() might hang if there are active connections in the pool being kept alive
    // Since this is a script, we can force exit or close pool
    await pool.end();
  }
}

check();
