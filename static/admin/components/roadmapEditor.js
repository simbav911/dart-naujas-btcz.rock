// Roadmap editor functionality
export function initializeRoadmapFields(data = null) {
    const walletFields = document.getElementById('wallet-fields');
    const roadmapFields = document.getElementById('roadmap-fields');
    
    if (walletFields) walletFields.style.display = 'none';
    if (roadmapFields) roadmapFields.style.display = 'block';

    const progress = document.getElementById('roadmap-progress');
    const icon = document.getElementById('roadmap-icon');
    const status = document.getElementById('roadmap-status');
    const description = document.getElementById('roadmap-description');
    
    if (data?.frontMatter) {
        if (progress) progress.value = data.frontMatter.progress || 0;
        if (icon) icon.value = data.frontMatter.icon || '';
        if (status) status.value = data.frontMatter.status || 'planned';
        if (description) description.value = data.frontMatter.description || '';
    } else {
        if (progress) progress.value = 0;
        if (icon) icon.value = '';
        if (status) status.value = 'planned';
        if (description) description.value = '';
    }
}

export function getRoadmapData() {
    const data = {
        title: document.getElementById('title').value,
        description: document.getElementById('roadmap-description').value,
        status: document.getElementById('roadmap-status').value,
        progress: parseInt(document.getElementById('roadmap-progress').value) || 0,
        priority: document.getElementById('roadmap-priority').value,
        icon: document.getElementById('roadmap-icon').value,
        tags: [document.getElementById('roadmap-status').value]
    };

    // If icon doesn't start with /, add the path prefix
    if (data.icon && !data.icon.startsWith('/')) {
        data.icon = `/images/icons/${data.icon}`;
    }

    return data;
}