document.addEventListener('DOMContentLoaded', function() {
    // Check if we're running locally
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    const environmentNotice = document.getElementById('environment-notice');
    if (!isLocalhost) {
        environmentNotice.textContent = 'Admin panel is only available on localhost';
        document.body.innerHTML = '<div class="container mx-auto px-4 py-8"><h1 class="text-3xl font-bold text-red-600">Access Denied</h1><p>This admin panel is only accessible when running locally.</p></div>';
        return;
    }
    
    environmentNotice.textContent = 'Running in local development mode';

    // Initialize variables
    let currentContentType = null;
    let currentFilePath = null;
    const editorContainer = document.getElementById('editor-container');
    const welcomeMessage = document.getElementById('welcome-message');
    const currentSection = document.getElementById('current-section');
    const contentList = document.getElementById('content-list');
    const newContentBtn = document.getElementById('newContentBtn');

    // Initialize Quill editor
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });

    // Content type configuration
    const contentTypes = {
        news: {
            path: 'content/en/news',
            template: {
                frontMatter: (title) => ({
                    title: title,
                    date: new Date().toISOString(),
                    draft: false,
                    author: "BitcoinZ Team",
                    categories: ["Update"],
                    tags: [],
                    type: "news",
                    layout: "single"
                })
            }
        },
        roadmap: {
            path: 'content/en/roadmap',
            template: {
                frontMatter: (title) => ({
                    title: title,
                    date: new Date().toISOString(),
                    draft: false,
                    type: "roadmap",
                    layout: "single"
                })
            }
        },
        wallets: {
            path: 'content/en/wallets',
            template: {
                frontMatter: (title) => ({
                    title: title,
                    date: new Date().toISOString(),
                    draft: false,
                    type: "wallet",
                    layout: "single"
                })
            }
        },
        'why-bitcoinz': {
            path: 'content/en/why-bitcoinz',
            template: {
                frontMatter: (title) => ({
                    title: title,
                    date: new Date().toISOString(),
                    draft: false,
                    type: "page",
                    layout: "single"
                })
            }
        }
    };

    // Handle content type selection
    document.querySelectorAll('.content-type-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const type = this.dataset.type;
            currentContentType = type;
            currentSection.textContent = this.textContent.trim();
            
            // Show editor container and hide welcome message
            editorContainer.classList.remove('hidden');
            welcomeMessage.classList.add('hidden');

            // Load existing content
            await loadExistingContent(type);
        });
    });

    // Load existing content for a content type
    async function loadExistingContent(type) {
        try {
            const response = await fetch(`/api/content?type=${type}`);
            const files = await response.json();
            
            contentList.innerHTML = files.map(file => `
                <div class="py-2 px-3 hover:bg-gray-100 cursor-pointer content-item" data-path="${file.path}">
                    ${file.title}
                </div>
            `).join('');

            // Add click handlers for content items
            document.querySelectorAll('.content-item').forEach(item => {
                item.addEventListener('click', () => loadContent(item.dataset.path));
            });
        } catch (error) {
            console.error('Error loading content:', error);
            contentList.innerHTML = '<div class="text-red-500 p-2">Error loading content</div>';
        }
    }

    // Load specific content
    async function loadContent(path) {
        try {
            const response = await fetch(`/api/content/${encodeURIComponent(path)}`);
            const content = await response.json();
            
            currentFilePath = path;
            document.getElementById('title').value = content.title || '';
            quill.root.innerHTML = content.content || '';
        } catch (error) {
            console.error('Error loading content:', error);
            alert('Error loading content. Please try again.');
        }
    }

    // New content button
    newContentBtn.addEventListener('click', function() {
        if (!currentContentType) {
            alert('Please select a content type first');
            return;
        }

        currentFilePath = null;
        document.getElementById('title').value = '';
        quill.root.innerHTML = '';
        editorContainer.classList.remove('hidden');
        welcomeMessage.classList.add('hidden');
    });

    // Preview functionality
    const previewBtn = document.getElementById('previewBtn');
    const preview = document.getElementById('preview');
    
    previewBtn.addEventListener('click', function() {
        const content = quill.root.innerHTML;
        preview.innerHTML = marked.parse(content);
    });

    // Save functionality
    const saveBtn = document.getElementById('saveBtn');
    const titleInput = document.getElementById('title');
    
    saveBtn.addEventListener('click', async function() {
        const title = titleInput.value;
        const content = quill.root.innerHTML;
        
        if (!title) {
            alert('Please enter a title');
            return;
        }

        if (!currentContentType) {
            alert('Please select a content type');
            return;
        }

        try {
            const typeConfig = contentTypes[currentContentType];
            const timestamp = new Date().toISOString();
            const fileName = currentFilePath || `${typeConfig.path}/${timestamp.split('T')[0]}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
            
            // Create the content in Hugo format
            const frontMatter = typeConfig.template.frontMatter(title);
            const hugoContent = `---
${Object.entries(frontMatter).map(([key, value]) => {
    if (Array.isArray(value)) {
        return `${key}: ${JSON.stringify(value)}`;
    }
    return `${key}: "${value}"`;
}).join('\n')}
---

${content}`;

            const response = await fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    path: fileName,
                    content: hugoContent,
                    message: currentFilePath ? `Update ${currentContentType}: ${title}` : `Add ${currentContentType}: ${title}`
                })
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Content saved successfully!');
                await loadExistingContent(currentContentType);
                if (!currentFilePath) {
                    titleInput.value = '';
                    quill.setContents([]);
                }
            } else {
                throw new Error(result.error || 'Failed to save content');
            }
            
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Error saving content. Please try again.');
        }
    });
});
