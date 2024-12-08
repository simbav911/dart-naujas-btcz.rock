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
        const files = await fs.readdir(contentPath);
        
        const contentFiles = await Promise.all(files
            .filter(file => file.endsWith('.md'))
            .map(async file => {
                const filePath = path.join(contentPath, file);
                const content = await fs.readFile(filePath, 'utf8');
                const titleMatch = content.match(/title:\s*"([^"]+)"/);
                return {
                    path: `content/en/${type}/${file}`,
                    title: titleMatch ? titleMatch[1] : file
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

        const [, frontMatter, markdown] = frontMatterMatch;
        const titleMatch = frontMatter.match(/title:\s*"([^"]+)"/);

        res.json({
            title: titleMatch ? titleMatch[1] : '',
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
        const result = await githubHandler.createOrUpdateFile(filePath, content, message);
        
        // Also save locally
        const localPath = path.join(__dirname, filePath);
        await fs.mkdir(path.dirname(localPath), { recursive: true });
        await fs.writeFile(localPath, content);
        
        res.json(result);
    } catch (error) {
        console.error('Error saving content:', error);
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
