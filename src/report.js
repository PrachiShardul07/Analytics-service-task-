require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('pino');
const db = require('./db');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const app = express();
app.use(bodyParser.json());

// GET /stats?site_id=site-abc-123&date=2025-11-12
app.get('/stats', async (req, res) => {
  const site_id = req.query.site_id;
  const date = req.query.date; // optional YYYY-MM-DD

  if (!site_id) return res.status(400).json({ error: 'site_id required' });

  try {
    // Build date filters
    let where = 'WHERE site_id = $1';
    const params = [site_id];
    if (date) {
      params.push(date);
      where += ` AND date(event_ts) = $${params.length}`;
    }

    // total views
    const totalQ = `SELECT COUNT(*)::int as total FROM events ${where}`;
    const totRes = await db.query(totalQ, params);

    // unique users (non-null user_id)
    const uniqueQ = `SELECT COUNT(DISTINCT user_id)::int as unique_users FROM events ${where}`;
    const uniqRes = await db.query(uniqueQ, params);

    // top paths
    const topQ = `
      SELECT COALESCE(path, '') as path, COUNT(*)::int as views
      FROM events
      ${where}
      GROUP BY path
      ORDER BY views DESC
      LIMIT 10
    `;
    const topRes = await db.query(topQ, params);

    const response = {
      site_id,
      date: date || null,
      total_views: totRes.rows[0].total,
      unique_users: uniqRes.rows[0].unique_users,
      top_paths: topRes.rows.map(r => ({ path: r.path, views: r.views }))
    };

    return res.json(response);
  } catch (err) {
    logger.error({ err }, 'reporting error');
    return res.status(500).json({ error: 'internal_error' });
  }
});

const port = process.env.REPORT_PORT || 3001;
app.listen(port, () => logger.info(`Reporting API listening on ${port}`));
