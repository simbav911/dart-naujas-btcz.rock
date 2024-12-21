const fs = require('fs');
const path = require('path');

const roadmapDir = path.join(__dirname, 'content/roadmap');

fs.readdir(roadmapDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        if (file.endsWith('.md')) {
            const filePath = path.join(roadmapDir, file);

            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                    console.error(`Error reading file ${file}:`, err);
                    return;
                }

                const updatedContent = content.replace(
                    /icon: "\/images\//g,
                    'icon: "images/'
                );

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