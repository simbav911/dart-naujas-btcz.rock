require('dotenv').config();
const express = require('express');
const path = require('path');
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

// API endpoint for saving content
app.post('/api/save', async (req, res) => {
    try {
        const { path: filePath, content, message } = req.body;
        const result = await githubHandler.createOrUpdateFile(filePath, content, message);
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
