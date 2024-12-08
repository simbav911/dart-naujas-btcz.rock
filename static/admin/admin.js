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
    const walletFields = document.getElementById('wallet-fields');
    const roadmapFields = document.getElementById('roadmap-fields');

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

    // Wallet-specific functions
    function addPlatform() {
        const platformList = document.getElementById('platform-list');
        const platformDiv = document.createElement('div');
        platformDiv.className = 'platform-entry grid grid-cols-3 gap-2';
        platformDiv.innerHTML = `
            <input type="text" placeholder="Platform Name" class="platform-name rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
            <input type="text" placeholder="Download URL" class="platform-url rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
            <div class="flex items-center">
                <input type="text" placeholder="Version" class="platform-version w-2/3 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <button type="button" class="remove-platform ml-2 px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                    Remove
                </button>
            </div>
        `;
        platformList.appendChild(platformDiv);

        platformDiv.querySelector('.remove-platform').addEventListener('click', () => {
            platformDiv.remove();
        });
    }

    function addListItem(listId, placeholder) {
        const list = document.getElementById(listId);
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex items-center space-x-2';
        itemDiv.innerHTML = `
            <input type="text" placeholder="${placeholder}" class="flex-grow rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
            <button type="button" class="remove-item px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                Remove
            </button>
        `;
        list.appendChild(itemDiv);

        itemDiv.querySelector('.remove-item').addEventListener('click', () => {
            itemDiv.remove();
        });
    }

    // Add event listeners for wallet-specific buttons
    document.getElementById('add-platform').addEventListener('click', addPlatform);
    document.getElementById('add-feature').addEventListener('click', () => addListItem('features-list', 'Enter feature'));
    document.getElementById('add-requirement').addEventListener('click', () => addListItem('requirements-list', 'Enter requirement'));

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
        wallets: {
            path: 'content/en/wallets',
            template: {
                frontMatter: (data) => ({
                    title: data.title,
                    description: data.description,
                    date: new Date().toISOString(),
                    type: "wallet",
                    image: data.image,
                    features: data.features,
                    platforms: data.platforms,
                    requirements: data.requirements,
                    draft: false
                })
            }
        },
        roadmap: {
            path: 'content/en/roadmap',
            template: {
                frontMatter: (title) => ({
                    title: title,
                    description: "",
                    date: new Date().toISOString(),
                    year: new Date().getFullYear(),
                    section: "roadmap",
                    type: "roadmap",
                    layout: "single",
                    status: "planned",
                    progress: 0,
                    tags: [],
                    icon: "/images/icons/default.svg",
                    priority: "medium"
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
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            currentContentType = type;
            
            // Reset fields
            document.getElementById('title').value = '';
            quill.setContents([]);
            
            // Hide all specific fields first
            const walletFields = document.getElementById('wallet-fields');
            const roadmapFields = document.getElementById('roadmap-fields');
            if (walletFields) walletFields.style.display = 'none';
            if (roadmapFields) roadmapFields.style.display = 'none';

            // Show specific fields based on content type
            if (type === 'wallets' && walletFields) {
                walletFields.style.display = 'block';
            } else if (type === 'roadmap' && roadmapFields) {
                roadmapFields.style.display = 'block';
            }

            currentSection.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            loadExistingContent(type);
            editorContainer.classList.remove('hidden');
            welcomeMessage.classList.add('hidden');
        });
    });

    // Load existing content for a content type
    async function loadExistingContent(type) {
        try {
            const response = await fetch(`/api/content?type=${encodeURIComponent(type)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
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
            contentList.innerHTML = '<div class="text-red-500 p-2">Error loading content: ' + error.message + '</div>';
        }
    }

    // Load specific content
    async function loadContent(path) {
        try {
            const response = await fetch(`/api/content/${encodeURIComponent(path)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (data) {
                document.getElementById('title').value = data.title || '';
                
                // Handle roadmap-specific fields
                if (currentContentType === 'roadmap') {
                    const progress = document.getElementById('roadmap-progress');
                    const icon = document.getElementById('roadmap-icon');
                    const status = document.getElementById('roadmap-status');
                    
                    if (progress) progress.value = data.frontMatter?.progress || 0;
                    if (icon) icon.value = data.frontMatter?.icon || 'planned';
                    if (status) status.value = data.frontMatter?.status || 'gray';
                }
                
                // Handle wallet-specific fields
                if (currentContentType === 'wallets') {
                    document.getElementById('wallet-description').value = data.frontMatter?.description || '';
                    document.getElementById('wallet-image').value = data.frontMatter?.image || '';
                    
                    // Load platforms
                    const platformList = document.getElementById('platform-list');
                    platformList.innerHTML = '';
                    if (data.frontMatter?.platforms) {
                        data.frontMatter.platforms.forEach(platform => {
                            const platformDiv = document.createElement('div');
                            platformDiv.className = 'platform-entry grid grid-cols-3 gap-2';
                            platformDiv.innerHTML = `
                                <input type="text" value="${platform.name}" class="platform-name rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <input type="text" value="${platform.download_url}" class="platform-url rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <div class="flex items-center">
                                    <input type="text" value="${platform.version}" class="platform-version w-2/3 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                    <button type="button" class="remove-platform ml-2 px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                                        Remove
                                    </button>
                                </div>
                            `;
                            platformList.appendChild(platformDiv);
                        });
                    }

                    // Load features
                    const featuresList = document.getElementById('features-list');
                    featuresList.innerHTML = '';
                    if (data.frontMatter?.features) {
                        data.frontMatter.features.forEach(feature => {
                            const featureDiv = document.createElement('div');
                            featureDiv.className = 'flex items-center space-x-2';
                            featureDiv.innerHTML = `
                                <input type="text" value="${feature}" class="flex-grow rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <button type="button" class="remove-item px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                                    Remove
                                </button>
                            `;
                            featuresList.appendChild(featureDiv);
                        });
                    }

                    // Load requirements
                    const requirementsList = document.getElementById('requirements-list');
                    requirementsList.innerHTML = '';
                    if (data.frontMatter?.requirements) {
                        data.frontMatter.requirements.forEach(requirement => {
                            const requirementDiv = document.createElement('div');
                            requirementDiv.className = 'flex items-center space-x-2';
                            requirementDiv.innerHTML = `
                                <input type="text" value="${requirement}" class="flex-grow rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <button type="button" class="remove-item px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                                    Remove
                                </button>
                            `;
                            requirementsList.appendChild(requirementDiv);
                        });
                    }
                }

                quill.root.innerHTML = data.content || '';
                currentFilePath = path;
            }
        } catch (error) {
            console.error('Error loading content:', error);
            alert('Error loading content: ' + error.message);
        }
    }

    // New content button
    newContentBtn.addEventListener('click', function() {
        if (!currentContentType) {
            alert('Please select a content type first');
            return;
        }

        // Reset form
        titleInput.value = '';
        quill.setContents([]);
        currentFilePath = null;

        // Reset roadmap fields if they exist
        const progress = document.getElementById('roadmap-progress');
        const icon = document.getElementById('roadmap-icon');
        const status = document.getElementById('roadmap-status');
        
        if (progress) progress.value = 0;
        if (icon) icon.value = 'planned';
        if (status) status.value = 'gray';

        // Reset wallet fields if they exist
        if (currentContentType === 'wallets') {
            const description = document.getElementById('wallet-description');
            const image = document.getElementById('wallet-image');
            const platformList = document.getElementById('platform-list');
            const featuresList = document.getElementById('features-list');
            const requirementsList = document.getElementById('requirements-list');

            if (description) description.value = '';
            if (image) image.value = '';
            if (platformList) platformList.innerHTML = '';
            if (featuresList) featuresList.innerHTML = '';
            if (requirementsList) requirementsList.innerHTML = '';
        }
    });

    // Preview functionality
    const previewBtn = document.getElementById('previewBtn');
    const preview = document.getElementById('preview');
    
    previewBtn.addEventListener('click', function() {
        const content = quill.root.innerHTML;
        preview.innerHTML = marked.parse(content);
    });

    // Helper function to gather wallet data
    function getWalletData() {
        const data = {
            title: document.getElementById('title').value,
            description: document.getElementById('wallet-description').value,
            image: document.getElementById('wallet-image').value,
            platforms: [],
            features: [],
            requirements: []
        };

        // Gather platforms
        document.querySelectorAll('.platform-entry').forEach(entry => {
            data.platforms.push({
                name: entry.querySelector('.platform-name').value,
                download_url: entry.querySelector('.platform-url').value,
                version: entry.querySelector('.platform-version').value
            });
        });

        // Gather features
        document.querySelectorAll('#features-list input').forEach(input => {
            if (input.value.trim()) {
                data.features.push(input.value.trim());
            }
        });

        // Gather requirements
        document.querySelectorAll('#requirements-list input').forEach(input => {
            if (input.value.trim()) {
                data.requirements.push(input.value.trim());
            }
        });

        return data;
    }

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
            let frontMatter;
            if (currentContentType === 'wallets') {
                const walletData = getWalletData();
                frontMatter = typeConfig.template.frontMatter(walletData);
            } else if (currentContentType === 'roadmap') {
                frontMatter = typeConfig.template.frontMatter(title);
                frontMatter.progress = parseInt(document.getElementById('roadmap-progress')?.value || 0);
                frontMatter.status = document.getElementById('roadmap-status')?.value || 'planned';
                
                // Map status to icon
                const statusIconMap = {
                    'green': '/images/icons/check-circle.svg',
                    'yellow': '/images/icons/in-progress.svg',
                    'blue': '/images/icons/planned.svg',
                    'gray': '/images/icons/pending.svg'
                };
                frontMatter.icon = statusIconMap[frontMatter.status] || '/images/icons/default.svg';
                
                // Set tags based on status
                const statusTagMap = {
                    'green': ['Completed'],
                    'yellow': ['In Progress'],
                    'blue': ['Planned'],
                    'gray': ['Pending']
                };
                frontMatter.tags = statusTagMap[frontMatter.status] || [];
                
                // Update description if empty
                if (!frontMatter.description) {
                    frontMatter.description = title;
                }
            } else {
                frontMatter = typeConfig.template.frontMatter(title);
            }

            const hugoContent = `---
${Object.entries(frontMatter).map(([key, value]) => {
    if (Array.isArray(value)) {
        return `${key}: ${JSON.stringify(value)}`;
    } else if (typeof value === 'object' && value !== null) {
        return `${key}:\n${Object.entries(value).map(([k, v]) => `  ${k}: "${v}"`).join('\n')}`;
    } else if (typeof value === 'number') {
        return `${key}: ${value}`;
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }

            alert('Content saved successfully!');
            await loadExistingContent(currentContentType);
            
            if (!currentFilePath) {
                titleInput.value = '';
                quill.setContents([]);
                
                // Reset roadmap fields
                if (currentContentType === 'roadmap') {
                    const progress = document.getElementById('roadmap-progress');
                    const status = document.getElementById('roadmap-status');
                    if (progress) progress.value = 0;
                    if (status) status.value = 'gray';
                }
                
                // Reset wallet fields
                if (currentContentType === 'wallets') {
                    document.getElementById('wallet-description').value = '';
                    document.getElementById('wallet-image').value = '';
                    document.getElementById('platform-list').innerHTML = '';
                    document.getElementById('features-list').innerHTML = '';
                    document.getElementById('requirements-list').innerHTML = '';
                }
            }
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Error saving content: ' + error.message);
        }
    });
});
