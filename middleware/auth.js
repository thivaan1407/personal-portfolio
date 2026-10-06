const crypto = require('crypto');

// Protects write routes. Send the key in the "x-admin-key" header.
module.exports = function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_KEY || '';
  const given = String(req.get('x-admin-key') || '');

  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  const ok = expected.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) return res.status(401).json({ error: 'Missing or invalid admin key.' });
  next();
};
