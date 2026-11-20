const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { seedDemoContent } = require('../scripts/seedDemoContent');

test('demo seed refuses production unless explicitly allowed', async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  try {
    await assert.rejects(
      seedDemoContent(),
      /production demo seeding requires the --allow-production flag/i
    );
    assert.equal(mongoose.connection.readyState, 0);
  } finally {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }
  }
});

test('production seed opt-in still requires a database URI', async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalMongoUri = process.env.MONGODB_URI;
  process.env.NODE_ENV = 'production';
  delete process.env.MONGODB_URI;

  try {
    await assert.rejects(
      seedDemoContent({ allowProduction: true }),
      /MONGODB_URI must be configured/i
    );
    assert.equal(mongoose.connection.readyState, 0);
  } finally {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }

    if (originalMongoUri === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = originalMongoUri;
    }
  }
});
