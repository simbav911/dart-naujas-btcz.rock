const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const form = formidable({
        uploadDir: path.join(process.cwd(), 'static', 'images', 'icons'),
        keepExtensions: true,
        filter: function ({name, originalFilename, mimetype}) {
            // Only accept SVG files
            return mimetype === 'image/svg+xml' || originalFilename.endsWith('.svg');
        }
    });

    try {
        const [fields, files] = await form.parse(req);
        
        if (!files.icon || files.icon.length === 0) {
            res.status(400).json({ error: 'No icon file uploaded' });
            return;
        }

        const file = files.icon[0];
        const oldPath = file.filepath;
        const newPath = path.join(process.cwd(), 'static', 'images', 'icons', file.originalFilename);

        // Rename the file to its original name
        fs.renameSync(oldPath, newPath);

        res.json({ 
            success: true, 
            filename: file.originalFilename,
            path: `/images/icons/${file.originalFilename}`
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload icon' });
    }
};
