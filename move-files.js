const fs = require('fs').promises;
const path = require('path');

async function moveFiles() {
    const contentDir = path.join(__dirname, 'content', 'en');
    const files = await fs.readdir(contentDir);

    for (const file of files) {
        if (!file.endsWith('.md') || file === '_index.md') continue;

        const filePath = path.join(contentDir, file);
        const stat = await fs.stat(filePath);
        
        if (!stat.isFile()) continue;

        let targetDir = null;
        
        // Determine target directory based on filename patterns
        if (file.includes('-wallet')) {
            targetDir = 'wallets';
        } else if (file.match(/^\d{4}-\d{2}-\d{2}-/)) {
            targetDir = 'news';
        } else {
            targetDir = 'roadmap';
        }

        const targetPath = path.join(contentDir, targetDir);
        const targetFile = path.join(targetPath, file);

        try {
            await fs.access(targetFile);
            console.log(`File ${file} already exists in ${targetDir}`);
        } catch {
            await fs.rename(filePath, targetFile);
            console.log(`Moved ${file} to ${targetDir}/`);
        }
    }
}

moveFiles().catch(console.error);