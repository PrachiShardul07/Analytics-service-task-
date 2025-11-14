require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('pino');
const { validateEvent } = require('./validation');
const { pushEvent } = require('./queue');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const app = express();
app.use(bodyParser.json());

app.post('/event', async (req, res) => {
  const { error, value } = validateEvent(req.body);
  if (error) {
    logger.warn({ err: error }, 'validation failed');
    return res.status(400).json({ error: error.message });
  }

  // push to queue (async) and immediately respond
  try {
    // pushEvent returns a promise; don't await a long time
    await pushEvent(value); // quick Redis push; still awaits to ensure enqueued
    // Immediately return success
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    logger.error({ err }, 'failed to enqueue');
    return res.status(500).json({ error: 'failed to enqueue' });
  }
});

const port = process.env.INGEST_PORT || 3000;
app.listen(port, () => logger.info(`Ingest API listening on ${port}`));
