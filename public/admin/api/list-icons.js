const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    try {
        const iconsDir = path.join(process.cwd(), 'static', 'images', 'icons');
        const files = fs.readdirSync(iconsDir);
        const icons = files.filter(file => file.endsWith('.svg'));
        res.json(icons);
    } catch (error) {
        console.error('Error listing icons:', error);
        res.status(500).json({ error: 'Failed to list icons' });
    }
};
