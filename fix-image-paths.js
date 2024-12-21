const fs = require('fs');
const path = require('path');

const newsDir = path.join(__dirname, 'content/en/news');

// Read all files in the news directory
fs.readdir(newsDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        if (file.endsWith('.md')) {
            const filePath = path.join(newsDir, file);
            
            // Read the file content
            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                    console.error(`Error reading file ${file}:`, err);
                    return;
                }

                // Replace image paths that start with a slash
                const updatedContent = content.replace(
                    /image: "\/images\//g,
                    'image: "images/'
                );

                // Write the updated content back to the file
                if (updatedContent !== content) {
                    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
                        if (err) {
                            console.error(`Error writing file ${file}:`, err);
                            return;
                        }
                        console.log(`Updated ${file}`);
                    });
                }
            });
        }
    });
});