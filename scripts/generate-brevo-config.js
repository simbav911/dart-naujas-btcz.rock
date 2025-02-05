// Generate Brevo config during build time
const fs = require('fs');
const path = require('path');

// Get API key and List ID from environment variables
const apiKey = process.env.BREVO_API_KEY;
const listId = process.env.BREVO_LIST_ID;

if (!apiKey || !listId) {
    console.error('Missing required environment variables BREVO_API_KEY or BREVO_LIST_ID');
    process.exit(1);
}

const config = {
    listId: listId,
    apiUrl: 'https://api.brevo.com/v3',
    apiKey: apiKey
};

const outputDir = path.join(__dirname, '..', 'static', 'js');
const outputPath = path.join(outputDir, 'brevo-config.js');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const configContent = `window.BREVO_CONFIG = ${JSON.stringify(config, null, 2)};`;

try {
    fs.writeFileSync(outputPath, configContent);
    console.log('Brevo config generated successfully');
    console.log('Config values:', {
        listId: listId ? 'present' : 'missing',
        apiKey: apiKey ? 'present' : 'missing',
        outputPath
    });
} catch (error) {
    console.error('Error writing config file:', error);
    process.exit(1);
}