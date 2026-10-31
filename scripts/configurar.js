const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '..', '.env');
const contents = [
  '# Configuracion local. No compartas este archivo ni lo subas a Git.',
  'DATABASE="mongodb://127.0.0.1:27017/idurar_erp_crm"',
  `JWT_SECRET="${crypto.randomBytes(48).toString('hex')}"`,
  'NODE_ENV="development"',
  '# RESEND_API="tu_clave_opcional_para_enviar_correos"',
  '# OPENAI_API_KEY="tu_clave_opcional"',
  '',
].join('\n');

try {
  fs.writeFileSync(envPath, contents, { flag: 'wx', mode: 0o600 });
  console.log('Archivo backend/.env creado para MongoDB local.');
} catch (error) {
  if (error.code === 'EEXIST') {
    console.log('El archivo backend/.env ya existe. No se modifico.');
  } else {
    console.error('No se pudo crear backend/.env:', error.message);
    process.exitCode = 1;
  }
}
