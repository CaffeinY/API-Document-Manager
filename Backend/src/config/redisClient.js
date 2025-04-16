// redisClient.js
const { createClient } = require('redis');

require('dotenv').config();
// Load environment variables from .env file
const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedisClient () {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Redis client connected');
  }
}

module.exports = { redisClient, connectRedisClient  };
