require('dotenv').config();
const pino = require('pino');
const { popEvent } = require('./queue');
const db = require('./db');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

async function processEvent(event) {
  // Basic transform and insert to DB
  const query = `
    INSERT INTO events (site_id, event_type, path, user_id, event_ts)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [
    event.site_id,
    event.event_type,
    event.path || null,
    event.user_id || null,
    event.timestamp
  ];
  await db.query(query, values);
}

async function workerLoop() {
  logger.info('worker started');
  while (true) {
    try {
      const ev = await popEvent(5); // blocks up to 5 seconds
      if (!ev) continue; // no event, loop again
      try {
        await processEvent(ev);
      } catch (procErr) {
        logger.error({ err: procErr, event: ev }, 'processing failed');
        // Optionally push to a dead-letter queue or requeue
      }
    } catch (err) {
      logger.error({ err }, 'error popping event; sleeping 1s');
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

workerLoop().catch(err => {
  logger.fatal({ err }, 'worker crashed');
  process.exit(1);
});
