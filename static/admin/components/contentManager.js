import { contentTypes } from './contentTypes.js';
import { initializeWalletFields } from './walletEditor.js';

export class ContentManager {
    constructor() {
        this.currentType = null;
        this.currentFilePath = null;
        this.setupWalletButtons();
    }

    setupWalletButtons() {
        console.log('Setting up wallet buttons');
        const addPlatformBtn = document.getElementById('add-platform');
        const addFeatureBtn = document.getElementById('add-feature');
        const addRequirementBtn = document.getElementById('add-requirement');

        if (addPlatformBtn) {
            addPlatformBtn.addEventListener('click', () => {
                console.log('Adding new platform');
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
            });
        }

        if (addFeatureBtn) {
            addFeatureBtn.addEventListener('click', () => {
                console.log('Adding new feature');
                this.addListItem('features-list', 'Enter feature');
            });
        }

        if (addRequirementBtn) {
            addRequirementBtn.addEventListener('click', () => {
                console.log('Adding new requirement');
                this.addListItem('requirements-list', 'Enter requirement');
            });
        }
    }

    addListItem(listId, placeholder) {
        const list = document.getElementById(listId);
        if (!list) return;

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

    async handleContentTypeSelection(type) {
        console.log('Handling content type selection:', type);
        this.currentType = type;
        
        // Initialize fields based on content type
        if (type === 'wallets') {
            initializeWalletFields();
        }

        // Load existing content
        await this.loadExistingContent(type);
    }

    async loadExistingContent(type) {
        console.log('Loading existing content for type:', type);
        const response = await fetch(`/api/content?type=${encodeURIComponent(type)}`);
        if (!response.ok) {
            throw new Error(`Failed to load content: ${response.statusText}`);
        }
        return response.json();
    }

    async saveContent(content) {
        console.log('Saving content');
        const data = this.getCurrentData();
        const frontMatter = this.getFrontMatter(data);
        const hugoContent = this.createHugoContent(frontMatter, content);
        
        const fileName = this.currentFilePath || 
            this.createFileName(data.title);

        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                path: fileName,
                content: hugoContent,
                message: this.currentFilePath ? 
                    `Update ${this.currentType}: ${data.title}` : 
                    `Add ${this.currentType}: ${data.title}`
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to save content: ${response.statusText}`);
        }

        return response.json();
    }

    getCurrentData() {
        const data = {
            title: document.getElementById('title').value
        };

        if (this.currentType === 'wallets') {
            data.description = document.getElementById('wallet-description').value;
            data.image = document.getElementById('wallet-image').value;
            data.platforms = [];
            data.features = [];
            data.requirements = [];

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
        }

        return data;
    }

    getFrontMatter(data) {
        return contentTypes[this.currentType].template.frontMatter(data);
    }

    createFileName(title) {
        const timestamp = new Date().toISOString().split('T')[0];
        const safeName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return `content/en/${this.currentType}/${timestamp}-${safeName}.md`;
    }

    createHugoContent(frontMatter, content) {
        const frontMatterString = Object.entries(frontMatter)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `${key}: ${JSON.stringify(value)}`;
                }
                if (typeof value === 'object' && value !== null) {
                    return `${key}:\n${Object.entries(value)
                        .map(([k, v]) => `  ${k}: "${v}"`)
                        .join('\n')}`;
                }
                if (typeof value === 'number') {
                    return `${key}: ${value}`;
                }
                return `${key}: "${value}"`;
            })
            .join('\n');

        return `---\n${frontMatterString}\n---\n\n${content}`;
    }

    resetFields() {
        document.getElementById('title').value = '';
        if (this.currentType === 'wallets') {
            document.getElementById('wallet-description').value = '';
            document.getElementById('wallet-image').value = '';
            document.getElementById('platform-list').innerHTML = '';
            document.getElementById('features-list').innerHTML = '';
            document.getElementById('requirements-list').innerHTML = '';
        }
        this.currentFilePath = null;
    }
}