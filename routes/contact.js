const express = require('express');
const rateLimit = require('express-rate-limit');
const Message = require('../models/Message');

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Please try again in a few minutes.' },
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', limiter, async (req, res, next) => {
  try {
    const { name = '', email = '', message = '' } = req.body || {};

    if (!String(name).trim() || !String(message).trim()) {
      return res.status(400).json({ error: 'Name and message are required.' });
    }
    if (!emailPattern.test(String(email).trim())) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }

    await Message.create({ name, email, message });
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
});

module.exports = router;
