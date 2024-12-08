require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const GitHubHandler = require('./static/admin/github-handler');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('static'));

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
        const contentPath = path.join(__dirname, 'content/en', type);
        
        // Check if directory exists
        try {
            await fs.access(contentPath);
        } catch {
            return res.status(404).json({ error: `Content type '${type}' not found` });
        }
        
        const files = await fs.readdir(contentPath);
        
        const contentFiles = await Promise.all(files
            .filter(file => file.endsWith('.md'))
            .map(async file => {
                const filePath = path.join(contentPath, file);
                const content = await fs.readFile(filePath, 'utf8');
                const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
                let title = file;
                
                if (frontMatterMatch) {
                    const titleMatch = frontMatterMatch[1].match(/title:\s*"?([^"\n]+)"?/);
                    if (titleMatch) {
                        title = titleMatch[1];
                    }
                }
                
                return {
                    path: `content/en/${type}/${file}`,
                    title: title
                };
            }));

        res.json(contentFiles);
    } catch (error) {
        console.error('Error getting content list:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get specific content
app.get('/api/content/:path(*)', async (req, res) => {
    try {
        const filePath = path.join(__dirname, req.params.path);
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
        console.error('Error getting content:', error);
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

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'admin', 'index.html'));
});

app.listen(port, () => {
    console.log(`Admin panel server running at http://localhost:${port}/admin`);
});
