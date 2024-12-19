const init = () => {
    console.log('Initializing admin app');
    
    // Initialize Quill editor
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['link', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['clean']
            ]
        },
        placeholder: 'Enter content here...'
    });
    
    let currentType = null;
    let currentPath = null;
    
    // Content type buttons
    document.querySelectorAll('.content-type-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const type = btn.dataset.type;
            currentType = type;
            console.log('Content type button clicked:', type);
            
            document.getElementById('editor-container').classList.remove('hidden');
            document.getElementById('welcome-message').classList.add('hidden');
            document.getElementById('current-section').textContent = btn.textContent.trim();
            
            // Show/hide fields based on type
            const walletFields = document.getElementById('wallet-fields');
            const roadmapFields = document.getElementById('roadmap-fields');
            
            if (walletFields) walletFields.style.display = type === 'wallets' ? 'block' : 'none';
            if (roadmapFields) roadmapFields.style.display = type === 'roadmap' ? 'block' : 'none';

            // Load existing content
            try {
                const response = await fetch(`/api/content?type=${encodeURIComponent(type)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const files = await response.json();
                console.log('Received files:', files);

                // Update existing content list
                const contentList = document.getElementById('content-list');
                contentList.innerHTML = ''; // Clear current content

                files.forEach(file => {
                    const div = document.createElement('div');
                    div.className = 'p-2 hover:bg-gray-100 cursor-pointer';
                    div.textContent = file.title;
                    div.dataset.type = type;
                    div.dataset.path = file.path;
                    
                    div.addEventListener('click', async () => {
                        currentPath = file.path;
                        console.log('Loading content:', `${type}/${currentPath}`);
                        try {
                            const contentResponse = await fetch(`/api/content/${type}/${currentPath}`);
                            if (!contentResponse.ok) {
                                throw new Error(`HTTP error! status: ${contentResponse.status}`);
                            }
                            const data = await contentResponse.json();
                            console.log('Content loaded:', data);

                            // Fill in the form fields
                            document.getElementById('title').value = data.title || '';
                            
                            // Set editor content
                            quill.root.innerHTML = '';
                            if (data.content) {
                                quill.clipboard.dangerouslyPasteHTML(data.content);
                            }
                            
                            if (type === 'wallets') {
                                document.getElementById('wallet-description').value = data.frontMatter.description || '';
                                document.getElementById('wallet-image').value = data.frontMatter.image || '';
                                
                                // Clear existing lists
                                document.getElementById('platform-list').innerHTML = '';
                                document.getElementById('features-list').innerHTML = '';
                                document.getElementById('requirements-list').innerHTML = '';
                                
                                // Add platforms
                                if (data.frontMatter.platforms) {
                                    data.frontMatter.platforms.forEach(platform => {
                                        const addPlatformBtn = document.getElementById('add-platform');
                                        addPlatformBtn.click();
                                        const lastPlatform = document.querySelector('.platform-entry:last-child');
                                        if (lastPlatform) {
                                            lastPlatform.querySelector('.platform-name').value = platform.name || '';
                                            lastPlatform.querySelector('.platform-url').value = platform.download_url || '';
                                            lastPlatform.querySelector('.platform-version').value = platform.version || '';
                                        }
                                    });
                                }
                                
                                // Add features
                                if (data.frontMatter.features) {
                                    data.frontMatter.features.forEach(feature => {
                                        const addFeatureBtn = document.getElementById('add-feature');
                                        addFeatureBtn.click();
                                        const lastFeature = document.querySelector('#features-list .flex:last-child input');
                                        if (lastFeature) {
                                            lastFeature.value = feature;
                                        }
                                    });
                                }
                                
                                // Add requirements
                                if (data.frontMatter.requirements) {
                                    data.frontMatter.requirements.forEach(requirement => {
                                        const addRequirementBtn = document.getElementById('add-requirement');
                                        addRequirementBtn.click();
                                        const lastRequirement = document.querySelector('#requirements-list .flex:last-child input');
                                        if (lastRequirement) {
                                            lastRequirement.value = requirement;
                                        }
                                    });
                                }
                            }
                        } catch (error) {
                            console.error('Error loading content:', error);
                        }
                    });
                    contentList.appendChild(div);
                });

                console.log('Content list updated');
            } catch (error) {
                console.error('Error loading content:', error);
            }
        });
    });
    
    // Add platform button
    const addPlatformBtn = document.getElementById('add-platform');
    if (addPlatformBtn) {
        addPlatformBtn.addEventListener('click', () => {
            console.log('Adding platform');
            const platformList = document.getElementById('platform-list');
            const platformDiv = document.createElement('div');
            platformDiv.className = 'platform-entry grid grid-cols-3 gap-2 mb-2';
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
        });
    }
    
    // Add feature button
    const addFeatureBtn = document.getElementById('add-feature');
    if (addFeatureBtn) {
        addFeatureBtn.addEventListener('click', () => {
            console.log('Adding feature');
            const featuresList = document.getElementById('features-list');
            const featureDiv = document.createElement('div');
            featureDiv.className = 'flex items-center space-x-2 mb-2';
            featureDiv.innerHTML = `
                <input type="text" placeholder="Enter feature" class="flex-grow rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <button type="button" class="remove-item px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                    Remove
                </button>
            `;
            featuresList.appendChild(featureDiv);
            
            featureDiv.querySelector('.remove-item').addEventListener('click', () => {
                featureDiv.remove();
            });
        });
    }
    
    // Add requirement button
    const addRequirementBtn = document.getElementById('add-requirement');
    if (addRequirementBtn) {
        addRequirementBtn.addEventListener('click', () => {
            console.log('Adding requirement');
            const requirementsList = document.getElementById('requirements-list');
            const requirementDiv = document.createElement('div');
            requirementDiv.className = 'flex items-center space-x-2 mb-2';
            requirementDiv.innerHTML = `
                <input type="text" placeholder="Enter requirement" class="flex-grow rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <button type="button" class="remove-item px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                    Remove
                </button>
            `;
            requirementsList.appendChild(requirementDiv);
            
            requirementDiv.querySelector('.remove-item').addEventListener('click', () => {
                requirementDiv.remove();
            });
        });
    }

    // Save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            if (!currentType) {
                console.error('No content type selected');
                return;
            }

            try {
                // Get form data
                const title = document.getElementById('title').value;
                const content = quill.root.innerHTML;

                // Build frontmatter
                const frontMatter = {
                    title,
                    type: currentType === 'wallets' ? 'wallet' : currentType
                };

                if (currentType === 'wallets') {
                    frontMatter.description = document.getElementById('wallet-description').value;
                    frontMatter.image = document.getElementById('wallet-image').value;

                    // Get platforms
                    const platforms = [];
                    document.querySelectorAll('.platform-entry').forEach(entry => {
                        platforms.push({
                            name: entry.querySelector('.platform-name').value,
                            download_url: entry.querySelector('.platform-url').value,
                            version: entry.querySelector('.platform-version').value
                        });
                    });
                    if (platforms.length > 0) {
                        frontMatter.platforms = platforms;
                    }

                    // Get features
                    const features = [];
                    document.querySelectorAll('#features-list input').forEach(input => {
                        if (input.value) {
                            features.push(input.value);
                        }
                    });
                    if (features.length > 0) {
                        frontMatter.features = features;
                    }

                    // Get requirements
                    const requirements = [];
                    document.querySelectorAll('#requirements-list input').forEach(input => {
                        if (input.value) {
                            requirements.push(input.value);
                        }
                    });
                    if (requirements.length > 0) {
                        frontMatter.requirements = requirements;
                    }
                }

                // Use current path if editing, or generate new path if creating
                const savePath = currentPath ? 
                    `content/en/${currentType}/${currentPath}` :
                    `content/en/${currentType}/${title.toLowerCase().replace(/\s+/g, '-')}.md`;

                // Convert frontmatter to YAML
                const yamlFrontMatter = jsyaml.dump(frontMatter);
                const fullContent = `---\n${yamlFrontMatter}---\n\n${content}`;

                // Save content
                const response = await fetch('/api/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        path: savePath,
                        content: fullContent
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                console.log('Content saved successfully');
            } catch (error) {
                console.error('Error saving content:', error);
            }
        });
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}