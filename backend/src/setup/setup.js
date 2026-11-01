require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { globSync } = require('glob');
const fs = require('fs');
const { generate: uniqueId } = require('shortid');

const mongoose = require('mongoose');

async function setupApp() {
  try {
    if (!process.env.DATABASE) {
      throw new Error('Falta DATABASE en backend/.env. Ejecuta npm run configurar.');
    }
    await mongoose.connect(process.env.DATABASE, { serverSelectionTimeoutMS: 10000 });
    const Admin = require('../models/coreModels/Admin');
    const AdminPassword = require('../models/coreModels/AdminPassword');
    if (await Admin.exists({})) {
      throw new Error('Esta base de datos ya contiene administradores. No se volvera a inicializar.');
    }
    const newAdminPassword = new AdminPassword();

    const salt = uniqueId();

    const passwordHash = newAdminPassword.generateHash(salt, 'admin123');

    const demoAdmin = {
      email: 'admin@demo.com',
      name: 'IDURAR',
      surname: 'Admin',
      enabled: true,
      role: 'superadmin',
    };
    const result = await new Admin(demoAdmin).save();

    const AdminPasswordData = {
      password: passwordHash,
      emailVerified: true,
      salt: salt,
      user: result._id,
    };
    await new AdminPassword(AdminPasswordData).save();

    console.log('👍 Admin created : Done!');

    const Setting = require('../models/coreModels/Setting');

    const settingFiles = [];

    const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');
    console.log('🚀 ~ file: setup.js:30 ~ setupApp ~ settingsFiles:', settingsFiles);

    for (const filePath of settingsFiles) {
      const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      settingFiles.push(...file);
    }

    await Setting.insertMany(settingFiles);

    console.log('👍 Settings created : Done!');

    const Email = require('../models/coreModels/Email');
    const emailTemplate = JSON.parse(
      fs.readFileSync(__dirname + '/emailTemplate/index.json', 'utf-8')
    );

    await Email.insertMany([...emailTemplate]);
    console.log('👍 Email Templates Created : Done !');
    console.log('🥳 Setup completed :Success!');
    await mongoose.disconnect();
  } catch (e) {
    console.error('\n🚫 No se pudo completar la configuracion inicial:', e.message);
    await mongoose.disconnect();
    process.exitCode = 1;
  }
}

setupApp();
