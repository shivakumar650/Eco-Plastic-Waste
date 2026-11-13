const User = require('../models/User');

const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured');
    }

    if (
      process.env.NODE_ENV === 'production' &&
      (adminPassword.length < 16 || /^replace_with_/i.test(adminPassword))
    ) {
      throw new Error('Production requires ADMIN_EMAIL and an ADMIN_PASSWORD of at least 16 characters');
    }

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true,
      isVerified: true
    });

    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${adminUser.email}`);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  }
};

module.exports = {
  createAdminUser
};