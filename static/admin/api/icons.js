const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    try {
        const iconsDir = path.join(process.cwd(), 'static', 'images', 'icons');
        
        // Create the directory if it doesn't exist
        if (!fs.existsSync(iconsDir)) {
            fs.mkdirSync(iconsDir, { recursive: true });
        }
        
        const files = fs.readdirSync(iconsDir);
        const icons = files.filter(file => file.endsWith('.svg'));
        res.json(icons);
    } catch (error) {
        console.error('Error reading icons:', error);
        res.status(500).json({ error: 'Failed to load icons: ' + error.message });
    }
};
