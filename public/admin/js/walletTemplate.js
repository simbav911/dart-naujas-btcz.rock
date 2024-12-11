class WalletTemplateHandler {
    constructor() {
        this.form = document.getElementById('contentForm');
        this.previewArea = document.getElementById('previewArea');
        this.imageData = null;
        this.setupForm();
        this.setupImageHandling();
        this.setupEventListeners();
        this.githubConfig = {
            owner: 'btcz',
            repo: 'bitcoinz-website',
            branch: 'main',
            path: 'src/content/wallets'
        };
    }

    setupForm() {
        // Clear existing form
        this.form.innerHTML = '';

        // Add wallet form fields
        this.form.innerHTML = `
            <div class="space-y-4">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <button type="button" id="editModeBtn" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2">Edit Mode</button>
                        <button type="button" id="previewModeBtn" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Preview Mode</button>
                    </div>
                    <button type="button" id="submitToGithub" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        Submit to GitHub
                    </button>
                </div>

                <div id="editMode">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Wallet Name</label>
                        <input type="text" id="walletName" class="w-full p-2 border rounded-md" required>
                    </div>
                    
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea id="walletDescription" class="w-full p-2 border rounded-md h-24" required></textarea>
                    </div>

                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
                        <textarea id="walletFeatures" class="w-full p-2 border rounded-md h-24" 
                            placeholder="Secure Key Management&#10;Multi-Address Support&#10;Transaction History"></textarea>
                    </div>

                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Download Links</label>
                        <div id="downloadLinks" class="space-y-2">
                            <div class="flex gap-2">
                                <input type="text" placeholder="Platform (e.g., Windows)" class="platform-input w-1/4 p-2 border rounded-md">
                                <input type="text" placeholder="Version" class="version-input w-1/4 p-2 border rounded-md">
                                <input type="text" placeholder="Download URL" class="url-input w-1/2 p-2 border rounded-md">
                            </div>
                        </div>
                        <button type="button" id="addDownloadLink" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Add Download Link
                        </button>
                    </div>

                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Wallet Icon</label>
                        <div id="dropZone" class="bg-gray-100 p-4 border-2 border-dashed rounded-lg cursor-pointer">
                            <p class="text-gray-500">Drag and drop an image or click to select</p>
                        </div>
                    </div>
                </div>

                <div id="previewMode" class="hidden">
                    <div class="wallet-preview bg-gray-900 text-white p-6 rounded-lg">
                        <div class="wallet-icon mb-4">
                            <img id="previewIcon" src="/path/to/default-wallet-icon.png" alt="Wallet Icon" class="w-16 h-16 mx-auto">
                        </div>
                        <h2 id="previewTitle" class="text-2xl font-bold text-center mb-4"></h2>
                        <p id="previewDescription" class="text-gray-300 text-center mb-6"></p>
                        <div class="features-list mb-6">
                            <h3 class="text-xl font-semibold mb-3">Features</h3>
                            <ul id="previewFeatures" class="list-none space-y-2"></ul>
                        </div>
                        <div class="download-section">
                            <h3 class="text-xl font-semibold mb-3">Downloads</h3>
                            <div id="previewDownloads" class="grid gap-3"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for mode switching
        document.getElementById('editModeBtn').addEventListener('click', () => this.switchMode('edit'));
        document.getElementById('previewModeBtn').addEventListener('click', () => this.switchMode('preview'));

        // Add download link button functionality
        document.getElementById('addDownloadLink').addEventListener('click', () => {
            const downloadLinks = document.getElementById('downloadLinks');
            const newLink = document.createElement('div');
            newLink.className = 'flex gap-2';
            newLink.innerHTML = `
                <input type="text" placeholder="Platform (e.g., Windows)" class="platform-input w-1/4 p-2 border rounded-md">
                <input type="text" placeholder="Version" class="version-input w-1/4 p-2 border rounded-md">
                <input type="text" placeholder="Download URL" class="url-input w-1/2 p-2 border rounded-md">
                <button type="button" class="remove-link px-2 bg-red-500 text-white rounded-md hover:bg-red-600">×</button>
            `;
            downloadLinks.appendChild(newLink);

            newLink.querySelector('.remove-link').addEventListener('click', () => {
                newLink.remove();
            });
        });

        // Add live preview updates
        ['walletName', 'walletDescription', 'walletFeatures'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => this.updatePreview());
        });
    }

    setupImageHandling() {
        const dropZone = document.getElementById('dropZone');
        const imagePreview = document.getElementById('previewIcon');

        // Handle drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-blue-500');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-blue-500');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-blue-500');
            const file = e.dataTransfer.files[0];
            this.handleImageUpload(file);
        });

        // Handle click to select
        dropZone.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                this.handleImageUpload(file);
            };
            input.click();
        });
    }

    handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Update preview in the wallet card
                const previewIcon = document.getElementById('previewIcon');
                if (previewIcon) {
                    previewIcon.src = e.target.result;
                }

                // Store the image data
                this.imageData = {
                    base64: e.target.result,
                    width: img.width,
                    height: img.height,
                    type: file.type
                };

                // Update the markdown preview
                const markdownPreview = document.getElementById('imageMarkdown');
                if (markdownPreview) {
                    markdownPreview.textContent = `![${file.name}](${e.target.result})`;
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    switchMode(mode) {
        const editMode = document.getElementById('editMode');
        const previewMode = document.getElementById('previewMode');
        const editBtn = document.getElementById('editModeBtn');
        const previewBtn = document.getElementById('previewModeBtn');

        if (mode === 'preview') {
            editMode.classList.add('hidden');
            previewMode.classList.remove('hidden');
            editBtn.classList.remove('bg-blue-500');
            editBtn.classList.add('bg-gray-500');
            previewBtn.classList.remove('bg-gray-500');
            previewBtn.classList.add('bg-blue-500');
            this.updatePreview();
        } else {
            editMode.classList.remove('hidden');
            previewMode.classList.add('hidden');
            editBtn.classList.remove('bg-gray-500');
            editBtn.classList.add('bg-blue-500');
            previewBtn.classList.remove('bg-blue-500');
            previewBtn.classList.add('bg-gray-500');
        }
    }

    updatePreview() {
        const name = document.getElementById('walletName').value;
        const description = document.getElementById('walletDescription').value;
        const features = document.getElementById('walletFeatures').value.split('\n').filter(f => f.trim());
        
        // Update preview elements
        document.getElementById('previewTitle').textContent = name;
        document.getElementById('previewDescription').textContent = description;
        
        // Update features list
        const featuresList = document.getElementById('previewFeatures');
        featuresList.innerHTML = features.map(feature => `
            <li class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                ${feature}
            </li>
        `).join('');

        // Update download links
        const downloadsContainer = document.getElementById('previewDownloads');
        downloadsContainer.innerHTML = '';
        const linkElements = document.getElementById('downloadLinks').children;
        for (const element of linkElements) {
            const platform = element.querySelector('.platform-input').value;
            const version = element.querySelector('.version-input').value;
            const url = element.querySelector('.url-input').value;
            if (platform && version && url) {
                const downloadBtn = document.createElement('a');
                downloadBtn.href = url;
                downloadBtn.className = 'download-button bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center';
                downloadBtn.innerHTML = `
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download for ${platform} (${version})
                `;
                downloadsContainer.appendChild(downloadBtn);
            }
        }
    }

    setupEventListeners() {
        // Mode switching
        document.getElementById('editModeBtn').addEventListener('click', () => this.switchMode('edit'));
        document.getElementById('previewModeBtn').addEventListener('click', () => this.switchMode('preview'));

        // Add download link functionality
        document.getElementById('addDownloadLink').addEventListener('click', () => {
            const downloadLinks = document.getElementById('downloadLinks');
            const newLink = document.createElement('div');
            newLink.className = 'flex gap-2';
            newLink.innerHTML = `
                <input type="text" placeholder="Platform (e.g., Windows)" class="platform-input w-1/4 p-2 border rounded-md">
                <input type="text" placeholder="Version" class="version-input w-1/4 p-2 border rounded-md">
                <input type="text" placeholder="Download URL" class="url-input w-1/2 p-2 border rounded-md">
                <button type="button" class="remove-link px-2 bg-red-500 text-white rounded-md hover:bg-red-600">×</button>
            `;
            downloadLinks.appendChild(newLink);

            newLink.querySelector('.remove-link').addEventListener('click', () => {
                newLink.remove();
            });
        });

        // Live preview updates
        ['walletName', 'walletDescription', 'walletFeatures'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => this.updatePreview());
        });

        // GitHub submission handler
        document.getElementById('submitToGithub').addEventListener('click', () => {
            const content = this.generateContent();
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg p-6 max-w-4xl w-full">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold">Generated Content</h3>
                        <button id="closeModal" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-96">
                        <pre class="whitespace-pre-wrap text-sm">${this.escapeHtml(content)}</pre>
                    </div>
                    <div class="flex justify-between items-center">
                        <button id="copyContent" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                            </svg>
                            Copy Content
                        </button>
                        <a href="${this.generateGitHubUrl(content)}" target="_blank" 
                           class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            Open in GitHub
                        </a>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners for modal buttons
            modal.querySelector('#copyContent').addEventListener('click', () => {
                navigator.clipboard.writeText(content);
                const copyBtn = modal.querySelector('#copyContent');
                copyBtn.innerHTML = `
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Copied!
                `;
                copyBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
                copyBtn.classList.add('bg-green-500', 'hover:bg-green-600');
                setTimeout(() => {
                    copyBtn.innerHTML = `
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                        </svg>
                        Copy Content
                    `;
                    copyBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                    copyBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
                }, 2000);
            });
            
            modal.querySelector('#closeModal').addEventListener('click', () => {
                modal.remove();
            });
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    }

    generateContent() {
        const name = document.getElementById('walletName').value;
        const description = document.getElementById('walletDescription').value;
        const features = document.getElementById('walletFeatures').value.split('\n').filter(f => f.trim());
        
        // Collect download links
        const downloadLinks = [];
        const linkElements = document.getElementById('downloadLinks').children;
        for (const element of linkElements) {
            const platform = element.querySelector('.platform-input').value;
            const version = element.querySelector('.version-input').value;
            const url = element.querySelector('.url-input').value;
            if (platform && version && url) {
                downloadLinks.push({ platform, version, url });
            }
        }

        // Generate the content with image data
        let content = `---
title: "${name}"
description: "${description}"
date: ${new Date().toISOString().split('T')[0]}
features:
${features.map(f => `  - ${f}`).join('\n')}
downloadLinks:
${downloadLinks.map(link => `  - platform: ${link.platform}
    version: ${link.version}
    url: ${link.url}`).join('\n')}`;

        // Add image data if available
        if (this.imageData) {
            content += `\nimage:
  data: "${this.imageData.base64}"
  width: ${this.imageData.width}
  height: ${this.imageData.height}
  type: "${this.imageData.type}"`;
        }

        content += '\n---';
        return content;
    }

    generateGitHubUrl(content) {
        const fileName = this.generateFileName();
        const encodedContent = encodeURIComponent(content);
        
        // Generate the GitHub URL for creating a new file
        const baseUrl = 'https://github.com';
        const newFileUrl = `${baseUrl}/${this.githubConfig.owner}/${this.githubConfig.repo}/new/${this.githubConfig.branch}?filename=${this.githubConfig.path}/${fileName}&value=${encodedContent}`;
        
        return newFileUrl;
    }

    generateFileName() {
        const name = document.getElementById('walletName').value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        return `${name}.md`;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
