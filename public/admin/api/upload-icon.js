const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const MAX_FILE_SIZE = 500 * 1024; // 500KB in bytes

    const form = formidable({
        uploadDir: path.join(process.cwd(), 'static', 'images', 'icons'),
        keepExtensions: true,
        maxFileSize: MAX_FILE_SIZE,
        filter: function ({name, originalFilename, mimetype}) {
            // Accept both SVG and PNG files
            return (
                mimetype === 'image/svg+xml' || 
                mimetype === 'image/png' ||
                originalFilename.endsWith('.svg') || 
                originalFilename.endsWith('.png')
            );
        }
    });

    try {
        const [fields, files] = await form.parse(req);
        
        if (!files.icon || files.icon.length === 0) {
            res.status(400).json({ error: 'No icon file uploaded' });
            return;
        }

        const file = files.icon[0];

        // Additional file type validation
        if (!file.originalFilename.match(/\.(svg|png)$/i)) {
            fs.unlinkSync(file.filepath); // Clean up the uploaded file
            res.status(400).json({ error: 'Only SVG and PNG files are allowed' });
            return;
        }

        // Additional file size validation
        if (file.size > MAX_FILE_SIZE) {
            fs.unlinkSync(file.filepath); // Clean up the uploaded file
            res.status(400).json({ error: 'File size must not exceed 500KB' });
            return;
        }

        const oldPath = file.filepath;
        const newPath = path.join(process.cwd(), 'static', 'images', 'icons', file.originalFilename);

        // Create the icons directory if it doesn't exist
        const iconsDir = path.join(process.cwd(), 'static', 'images', 'icons');
        if (!fs.existsSync(iconsDir)) {
            fs.mkdirSync(iconsDir, { recursive: true });
        }

        // Rename the file to its original name
        fs.renameSync(oldPath, newPath);

        res.json({ 
            success: true, 
            filename: file.originalFilename,
            path: `/images/icons/${file.originalFilename}`,
            size: file.size,
            type: file.mimetype
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        if (error.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({ error: 'File size must not exceed 500KB' });
        } else {
            res.status(500).json({ error: 'Failed to upload icon' });
        }
    }
};
