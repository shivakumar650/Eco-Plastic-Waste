const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { seedDemoContent } = require('../scripts/seedDemoContent');

test('demo seed refuses production before connecting to MongoDB', async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  try {
    await assert.rejects(seedDemoContent(), /cannot be seeded in production/i);
    assert.equal(mongoose.connection.readyState, 0);
  } finally {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }
  }
});
