// Generate Brevo config during build time
const fs = require('fs');
const path = require('path');

const config = {
  listId: process.env.BREVO_LIST_ID || '',
  apiUrl: 'https://api.brevo.com/v3',
  apiKey: process.env.BREVO_API_KEY || ''
};

const configContent = `window.BREVO_CONFIG = ${JSON.stringify(config, null, 2)};`;
const outputPath = path.join(__dirname, '..', 'static', 'js', 'brevo-config.js');

fs.writeFileSync(outputPath, configContent);
console.log('Brevo config generated successfully');