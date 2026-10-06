const mongoose = require('mongoose');

// Cache the connection so serverless hosts (Vercel) reuse it between requests.
const cache = global._mongooseCache || (global._mongooseCache = { conn: null, promise: null });

async function connectDB() {
  if (cache.conn) return cache.conn;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');

  if (!cache.promise) {
    cache.promise = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  }
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.conn;
}

module.exports = { connectDB };
