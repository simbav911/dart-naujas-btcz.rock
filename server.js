require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { formidable } = require('formidable');
const GitHubHandler = require('./static/admin/github-handler');
const yaml = require('js-yaml');

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

// Helper function to parse markdown file
const parseMarkdownFile = async (filePath) => {
    const content = await fs.readFile(filePath, 'utf8');
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!frontMatterMatch) {
        throw new Error('Invalid content format');
    }

    const [, frontMatterStr, markdown] = frontMatterMatch;
    let frontMatter;
    try {
        frontMatter = yaml.load(frontMatterStr);
    } catch (error) {
        console.error('Error parsing YAML:', error);
        throw new Error('Failed to parse frontmatter');
    }

    // Clean up markdown content
    const cleanMarkdown = markdown
        .replace(/^\n+/, '') // Remove leading newlines
        .replace(/\n+$/, '') // Remove trailing newlines
        .replace(/\n\n\n+/g, '\n\n') // Replace multiple newlines with double newlines
        .trim();

    return {
        frontMatter,
        content: cleanMarkdown
    };
};

// Get list of content files
app.get('/api/content', async (req, res) => {
    try {
        const type = req.query.type;
        console.log(`Requested content type: ${type}`);
        
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
        
        try {
            await fs.access(config.path);
        } catch (accessError) {
            console.error(`Directory access error: ${accessError}`);
            return res.status(404).json({ error: `Content type '${type}' not found`, details: accessError.message });
        }
        
        const files = await fs.readdir(config.path);
        console.log(`Found ${files.length} files in directory`);
        
        const matchingFiles = files.filter(file => {
            if (file === '_index.md' || !file.endsWith('.md')) {
                return false;
            }
            if (type === 'news') {
                return /^\d{4}-\d{2}-.*\.md$/.test(file);
            }
            return true;
        });
        console.log(`Found ${matchingFiles.length} matching files for type: ${type}`);
        
        const contentFiles = await Promise.all(matchingFiles.map(async file => {
            const filePath = path.join(config.path, file);
            console.log(`Processing file: ${filePath}`);
            
            try {
                const { frontMatter } = await parseMarkdownFile(filePath);
                console.log(`Processed file: ${file} Title: ${frontMatter.title}`);
                
                return {
                    path: file,
                    title: frontMatter.title || file
                };
            } catch (error) {
                console.error(`Error processing file ${file}:`, error);
                return {
                    path: file,
                    title: file
                };
            }
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
        const requestPath = req.params.path;
        const contentType = requestPath.split('/')[0];
        
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

        const filename = path.basename(requestPath);
        const config = contentConfig[contentType];
        if (!config) {
            return res.status(400).json({ error: `Invalid content type: ${contentType}` });
        }

        const filePath = path.join(config.path, filename);
        console.log('Loading content from:', filePath);

        const { frontMatter, content } = await parseMarkdownFile(filePath);

        res.json({
            title: frontMatter.title,
            frontMatter,
            content
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

        const fullPath = path.join(__dirname, filePath);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });

        try {
            await fs.writeFile(fullPath, content, 'utf8');
        } catch (error) {
            console.error('Error saving file locally:', error);
            return res.status(500).json({ error: 'Failed to save file locally' });
        }

        try {
            await githubHandler.createOrUpdateFile(filePath, content, message || 'Update content');
        } catch (error) {
            console.error('Error saving to GitHub:', error);
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

        const form = formidable({
            uploadDir: iconsDir,
            keepExtensions: true,
            maxFileSize: 500 * 1024,
            multiples: false,
            filename: (name, ext, part) => {
                return part.originalFilename
            }
        });

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

            const allowedTypes = ['image/svg+xml', 'image/png'];
            if (!allowedTypes.includes(file.mimetype)) {
                fsSync.unlinkSync(file.filepath);
                return res.status(400).json({ 
                    error: 'Only SVG and PNG files are allowed' 
                });
            }

            const oldPath = file.filepath;
            const newPath = path.join(iconsDir, file.originalFilename);

            if (fsSync.existsSync(newPath)) {
                fsSync.unlinkSync(newPath);
            }

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
