require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');
const Resource = require('../models/Resource');
const User = require('../models/User');
const { createAdminUser } = require('../services/adminService');

const daysFromNow = (days, hours = 0) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000);

const upsertDemoRecords = async (Model, records, previousTitles = {}) => {
  for (const record of records) {
    const titles = [record.title, ...(previousTitles[record.title] || [])];
    await Model.findOneAndUpdate(
      { title: { $in: titles } },
      { $set: record },
      { upsert: true, new: true, runValidators: true }
    );
  }
};

const seedDemoContent = async ({ allowProduction = false } = {}) => {
  if (process.env.NODE_ENV === 'production' && !allowProduction) {
    throw new Error('Production demo seeding requires the --allow-production flag');
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be configured in server/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  try {
    await createAdminUser();
    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      throw new Error('Unable to find an admin account for demo content');
    }

    const campaigns = [
      {
        title: '[DEMO] Hussain Sagar Community Cleanup',
        description: 'A sample neighborhood cleanup event near Hussain Sagar. Bring reusable gloves and a refillable water bottle; collection bags and sorting guidance will be provided.',
        category: 'cleanup',
        startDate: daysFromNow(-1),
        endDate: daysFromNow(13),
        location: 'Tank Bund, Hyderabad, Telangana',
        organizer: admin._id,
        status: 'approved',
        maxParticipants: 40,
        tags: ['community', 'cleanup', 'river']
      },
      {
        title: '[DEMO] Plastic-Free Week Challenge',
        description: 'A sample week-long challenge to try reusable bags, bottles, and containers, then share practical tips with your community.',
        category: 'awareness',
        startDate: daysFromNow(7),
        endDate: daysFromNow(14),
        location: 'Miyapur Community Centre, Hyderabad, Telangana',
        organizer: admin._id,
        status: 'approved',
        maxParticipants: 100,
        tags: ['reuse', 'challenge', 'community']
      },
      {
        title: '[DEMO] School Recycling Workshop',
        description: 'A sample hands-on workshop introducing students to waste sorting, material reuse, and ways to reduce single-use packaging at school.',
        category: 'education',
        startDate: daysFromNow(21),
        endDate: daysFromNow(21, 3),
        location: 'Community Learning Centre, Secunderabad, Telangana',
        organizer: admin._id,
        status: 'approved',
        maxParticipants: 30,
        tags: ['students', 'education', 'recycling']
      }
    ];

    const resources = [
      {
        title: '[DEMO] Five Everyday Reusable Swaps',
        description: 'A practical starter guide to replacing common single-use items with reusable alternatives.',
        content: 'Start with one item you use often: a water bottle, shopping bag, or coffee cup. Keep it somewhere easy to remember. For food storage, use containers you already own before buying anything new. Wash and reuse items according to their care instructions. If a disposable item is still the best option for a situation, use it thoughtfully and check local guidance for disposal.',
        category: 'guides',
        type: 'text',
        author: admin._id,
        status: 'approved',
        tags: ['reuse', 'beginner', 'everyday'],
        difficulty: 'beginner',
        readTime: 3
      },
      {
        title: '[DEMO] How to Plan a Neighborhood Cleanup',
        description: 'A step-by-step checklist for organizing a safe, welcoming local cleanup.',
        content: 'Choose a public location and check whether permission is needed. Set a clear meeting point and time, and share what volunteers should bring. Provide gloves, bags, drinking water, and simple sorting instructions where possible. Ask volunteers to avoid hazardous items and report them to the appropriate local service. At the end, record what was collected and arrange disposal with the local waste provider.',
        category: 'articles',
        type: 'text',
        author: admin._id,
        status: 'approved',
        tags: ['cleanup', 'community', 'organizing'],
        difficulty: 'intermediate',
        readTime: 5
      },
      {
        title: '[DEMO] A Simple Guide to Sorting Plastic at Home',
        description: 'Learn how to check packaging labels and follow your local municipal recycling guidance.',
        content: 'Recycling rules vary between cities, so begin with your local municipal body’s accepted-material guidance. Check the item itself rather than relying only on a recycling symbol. Empty containers and follow local instructions about rinsing, lids, and labels. Keep non-accepted plastics out of recycling collection to help avoid contamination. When in doubt, ask your local waste service how the item should be handled.',
        category: 'tips',
        type: 'text',
        author: admin._id,
        status: 'approved',
        tags: ['recycling', 'sorting', 'beginner'],
        difficulty: 'beginner',
        readTime: 4
      },
      {
        title: '[DEMO] Reuse Ideas for Home and School',
        description: 'Simple ways to extend the useful life of clean packaging and everyday containers.',
        content: 'Before discarding a clean container, consider whether it can safely serve another purpose, such as storing craft supplies or organizing small items. Reuse only containers suitable for their new use, and do not repurpose packaging that held hazardous products for food or drink. Share useful, clean items through a school or community exchange when appropriate.',
        category: 'tips',
        type: 'text',
        author: admin._id,
        status: 'approved',
        tags: ['reuse', 'school', 'home'],
        difficulty: 'beginner',
        readTime: 3
      }
    ];

    await upsertDemoRecords(Campaign, campaigns, {
      '[DEMO] Hussain Sagar Community Cleanup': [
        '[DEMO] Riverside Park Community Cleanup'
      ]
    });
    await upsertDemoRecords(Resource, resources, {
      '[DEMO] A Simple Guide to Sorting Plastic at Home': [
        '[DEMO] A Simple Guide to Sorting Plastic'
      ]
    });

    console.log(`Demo content ready: ${campaigns.length} campaigns and ${resources.length} resources`);
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  seedDemoContent({
    allowProduction: process.argv.includes('--allow-production')
  }).catch((error) => {
    console.error('Failed to seed demo content:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { seedDemoContent };
