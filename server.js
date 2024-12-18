require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { formidable } = require('formidable');
const GitHubHandler = require('./static/admin/github-handler');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('static'));

// CORS middleware for local development
app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:1313', 'http://localhost:3000'];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Initialize GitHub handler
const githubHandler = new GitHubHandler(
    process.env.GITHUB_TOKEN,
    process.env.GITHUB_REPO,
    process.env.GITHUB_OWNER
);

// Get list of content files
app.get('/api/content', async (req, res) => {
    try {
        const type = req.query.type;
        console.log(`Requested content type: ${type}`);
        
        // Map content types to their directories
        const contentConfig = {
            'news': {
                path: path.join(__dirname, 'content/en/news')
            },
            'roadmap': {
                path: path.join(__dirname, 'content/en/roadmap')
            },
            'wallets': {
                path: path.join(__dirname, 'content/en/wallets')
            },
            'why-bitcoinz': {
                path: path.join(__dirname, 'content/en/why-bitcoinz')
            }
        };
        
        const config = contentConfig[type];
        if (!config) {
            console.error(`Invalid content type: ${type}`);
            return res.status(400).json({ error: `Invalid content type: ${type}` });
        }
        
        console.log(`Looking for content in: ${config.path}`);
        
        // Check if directory exists
        try {
            await fs.access(config.path);
        } catch (accessError) {
            console.error(`Directory access error: ${accessError}`);
            return res.status(404).json({ error: `Content type '${type}' not found`, details: accessError.message });
        }
        
        const files = await fs.readdir(config.path);
        console.log(`Found ${files.length} files in directory`);
        
        // Filter files based on content type
        const matchingFiles = files.filter(file => {
            // Skip index and non-markdown files
            if (file === '_index.md' || !file.endsWith('.md')) {
                return false;
            }
            
            // For news type, only include date-prefixed files
            if (type === 'news') {
                return /^\d{4}-\d{2}-.*\.md$/.test(file);
            }
            
            // For other types, include all markdown files
            return true;
        });
        console.log(`Found ${matchingFiles.length} matching files for type: ${type}`);
        
        const contentFiles = await Promise.all(matchingFiles
            .map(async file => {
                const filePath = path.join(config.path, file);
                console.log(`Processing file: ${filePath}`);
                
                const content = await fs.readFile(filePath, 'utf8');
                const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
                let title = file;
                
                if (frontMatterMatch) {
                    const titleMatch = frontMatterMatch[1].match(/title:\s*"?([^"\n]+)"?/);
                    if (titleMatch) {
                        title = titleMatch[1];
                    }
                }
                
                console.log(`Processed file: ${file}, Title: ${title}`);
                
                return {
                    path: file,
                    title: title
                };
            }));

        console.log(`Successfully processed ${contentFiles.length} files`);

        console.log(`Returning ${contentFiles.length} content files`);
        res.json(contentFiles);
    } catch (error) {
        console.error('Error getting content list:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

// Get content of a specific file
app.get('/api/content/:path(*)', async (req, res) => {
    try {
        // Extract the file path and determine content type
        const requestPath = req.params.path;
        const contentType = requestPath.split('/')[0];  // Get the content type from the path
        
        // Map content types to their directories
        const contentConfig = {
            'news': {
                path: path.join(__dirname, 'content/en/news')
            },
            'roadmap': {
                path: path.join(__dirname, 'content/en/roadmap')
            },
            'wallets': {
                path: path.join(__dirname, 'content/en/wallets')
            },
            'why-bitcoinz': {
                path: path.join(__dirname, 'content/en/why-bitcoinz')
            }
        };

        // Get the filename from the path
        const filename = path.basename(requestPath);
        
        // Find the correct base path for this content type
        const config = contentConfig[contentType];
        if (!config) {
            return res.status(400).json({ error: `Invalid content type: ${contentType}` });
        }

        // Construct the full file path
        const filePath = path.join(config.path, filename);
        console.log('Loading content from:', filePath);

        const content = await fs.readFile(filePath, 'utf8');
        
        // Parse frontmatter and content
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!frontMatterMatch) {
            throw new Error('Invalid content format');
        }

        const [, frontMatterStr, markdown] = frontMatterMatch;
        
        // Parse frontmatter into an object
        const frontMatter = {};
        const frontMatterLines = frontMatterStr.split('\n');
        frontMatterLines.forEach(line => {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                const [, key, value] = match;
                // Remove quotes if present
                frontMatter[key] = value.replace(/^"(.*)"$/, '$1');
                
                // Parse numbers
                if (!isNaN(value)) {
                    frontMatter[key] = parseFloat(value);
                }
            }
        });

        res.json({
            title: frontMatter.title,
            frontMatter,
            content: markdown.trim()
        });
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: error.message });
    }
});

// API endpoint for saving content
app.post('/api/save', async (req, res) => {
    try {
        const { path: filePath, content, message } = req.body;
        
        if (!filePath || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure the content directory exists
        const fullPath = path.join(__dirname, filePath);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });

        // Save locally
        try {
            await fs.writeFile(fullPath, content, 'utf8');
        } catch (error) {
            console.error('Error saving file locally:', error);
            return res.status(500).json({ error: 'Failed to save file locally' });
        }

        // Save to GitHub
        try {
            await githubHandler.createOrUpdateFile(filePath, content, message || 'Update content');
        } catch (error) {
            console.error('Error saving to GitHub:', error);
            // Don't fail if GitHub save fails, just log it
            console.warn('Content saved locally but failed to save to GitHub');
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error in save endpoint:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get list of icons
app.get('/api/icons', async (req, res) => {
    try {
        const iconsDir = path.join(__dirname, 'static', 'images', 'icons');
        
        // Create icons directory if it doesn't exist
        if (!fsSync.existsSync(iconsDir)) {
            fsSync.mkdirSync(iconsDir, { recursive: true });
        }

        const files = await fs.readdir(iconsDir);
        const icons = files.filter(file => file.endsWith('.svg') || file.endsWith('.png'));
        res.json(icons);
    } catch (error) {
        console.error('Error reading icons:', error);
        res.status(500).json({ error: 'Failed to load icons: ' + error.message });
    }
});

// Upload icon
app.post('/api/upload-icon', async (req, res) => {
    try {
        const iconsDir = path.join(__dirname, 'static', 'images', 'icons');
        
        // Create icons directory if it doesn't exist
        if (!fsSync.existsSync(iconsDir)) {
            try {
                fsSync.mkdirSync(iconsDir, { recursive: true });
                console.log('Created icons directory:', iconsDir);
            } catch (err) {
                console.error('Error creating icons directory:', err);
                return res.status(500).json({ 
                    error: 'Failed to create icons directory: ' + err.message 
                });
            }
        }

        // Configure formidable
        const form = formidable({
            uploadDir: iconsDir,
            keepExtensions: true,
            maxFileSize: 500 * 1024, // 500KB
            multiples: false,
            filename: (name, ext, part) => {
                return part.originalFilename // Keep original filename
            }
        });

        // Parse the form using Promise
        try {
            const [fields, files] = await form.parse(req);
            console.log('Parsed files:', files);

            if (!files || !files.icon || !files.icon[0]) {
                return res.status(400).json({ 
                    error: 'No icon file uploaded' 
                });
            }

            const file = files.icon[0];
            console.log('Processing file:', file);

            // Validate file type
            const allowedTypes = ['image/svg+xml', 'image/png'];
            if (!allowedTypes.includes(file.mimetype)) {
                fsSync.unlinkSync(file.filepath); // Clean up the invalid file
                return res.status(400).json({ 
                    error: 'Only SVG and PNG files are allowed' 
                });
            }

            const oldPath = file.filepath;
            const newPath = path.join(iconsDir, file.originalFilename);

            // If a file with the same name exists, delete it
            if (fsSync.existsSync(newPath)) {
                fsSync.unlinkSync(newPath);
            }

            // Rename the file to its original name
            fsSync.renameSync(oldPath, newPath);
            console.log('File saved successfully:', newPath);

            return res.json({ 
                success: true, 
                filename: file.originalFilename,
                path: `/images/icons/${file.originalFilename}`
            });
        } catch (parseError) {
            console.error('Error parsing form:', parseError);
            return res.status(500).json({ 
                error: 'Failed to parse upload form: ' + parseError.message 
            });
        }
    } catch (error) {
        console.error('Error in upload endpoint:', error);
        return res.status(500).json({ 
            error: 'Server error: ' + error.message 
        });
    }
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'admin', 'index.html'));
});

app.listen(port, () => {
    console.log(`Admin panel server running at http://localhost:${port}/admin`);
});
