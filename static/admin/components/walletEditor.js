export function initializeWalletFields(data = null) {
    console.log('Initializing wallet fields');
    
    // Show wallet fields container
    const walletFields = document.getElementById('wallet-fields');
    const roadmapFields = document.getElementById('roadmap-fields');
    if (walletFields) walletFields.style.display = 'block';
    if (roadmapFields) roadmapFields.style.display = 'none';

    // Set basic fields
    const description = document.getElementById('wallet-description');
    const image = document.getElementById('wallet-image');
    const platformList = document.getElementById('platform-list');
    const featuresList = document.getElementById('features-list');
    const requirementsList = document.getElementById('requirements-list');

    // Clear existing content
    if (description) description.value = data?.frontMatter?.description || '';
    if (image) image.value = data?.frontMatter?.image || '';
    if (platformList) platformList.innerHTML = '';
    if (featuresList) featuresList.innerHTML = '';
    if (requirementsList) requirementsList.innerHTML = '';

    // Setup button handlers
    setupWalletButtons();

    // Add initial empty fields if no data provided
    if (!data) {
        addPlatform();
        addListItem('features-list', 'Enter feature');
        addListItem('requirements-list', 'Enter requirement');
    }

    // Add existing data if provided
    if (data?.frontMatter) {
        if (data.frontMatter.platforms) {
            data.frontMatter.platforms.forEach(platform => addPlatform(platform));
        }
        if (data.frontMatter.features) {
            data.frontMatter.features.forEach(feature => addListItem('features-list', 'Enter feature', feature));
        }
        if (data.frontMatter.requirements) {
            data.frontMatter.requirements.forEach(requirement => addListItem('requirements-list', 'Enter requirement', requirement));
        }
    }
}

function setupWalletButtons() {
    console.log('Setting up wallet buttons');
    
    // Add Platform button
    const addPlatformBtn = document.getElementById('add-platform');
    if (addPlatformBtn) {
        addPlatformBtn.onclick = () => {
            console.log('Add Platform clicked');
            addPlatform();
        };
    }

    // Add Feature button
    const addFeatureBtn = document.getElementById('add-feature');
    if (addFeatureBtn) {
        addFeatureBtn.onclick = () => {
            console.log('Add Feature clicked');
            addListItem('features-list', 'Enter feature');
        };
    }

    // Add Requirement button
    const addRequirementBtn = document.getElementById('add-requirement');
    if (addRequirementBtn) {
        addRequirementBtn.onclick = () => {
            console.log('Add Requirement clicked');
            addListItem('requirements-list', 'Enter requirement');
        };
    }
}

export function addPlatform(data = null) {
    console.log('Adding platform', data);
    const platformList = document.getElementById('platform-list');
    if (!platformList) return;

    const platformDiv = document.createElement('div');
    platformDiv.className = 'platform-entry grid grid-cols-3 gap-2';
    platformDiv.innerHTML = `
        <input type="text" value="${data?.name || ''}" placeholder="Platform Name" class="platform-name rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
        <input type="text" value="${data?.download_url || ''}" placeholder="Download URL" class="platform-url rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
        <div class="flex items-center">
            <input type="text" value="${data?.version || ''}" placeholder="Version" class="platform-version w-2/3 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
            <button type="button" class="remove-platform ml-2 px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                Remove
            </button>
        </div>
    `;
    platformList.appendChild(platformDiv);

    platformDiv.querySelector('.remove-platform').onclick = () => {
        console.log('Removing platform');
        platformDiv.remove();
    };
}

export function addListItem(listId, placeholder, value = '') {
    console.log(`Adding list item to ${listId}`, value);
    const list = document.getElementById(listId);
    if (!list) return;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'flex items-center space-x-2';
    itemDiv.innerHTML = `
        <input type="text" value="${value}" placeholder="${placeholder}" class="flex-grow rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
        <button type="button" class="remove-item px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
            Remove
        </button>
    `;
    list.appendChild(itemDiv);

    itemDiv.querySelector('.remove-item').onclick = () => {
        console.log('Removing list item');
        itemDiv.remove();
    };
}