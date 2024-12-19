export function createFileName(type, title, contentTypes) {
    const timestamp = new Date().toISOString().split('T')[0];
    const safeName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `${contentTypes[type].path}/${timestamp}-${safeName}.md`;
}

export function createHugoContent(frontMatter, content) {
    const formatValue = (value) => {
        if (Array.isArray(value)) {
            return JSON.stringify(value);
        }
        if (typeof value === 'object' && value !== null) {
            return `\n${Object.entries(value)
                .map(([k, v]) => `  ${k}: "${v}"`)
                .join('\n')}`;
        }
        if (typeof value === 'number') {
            return value;
        }
        return `"${value}"`;
    };

    const frontMatterString = Object.entries(frontMatter)
        .map(([key, value]) => `${key}: ${formatValue(value)}`)
        .join('\n');

    return `---\n${frontMatterString}\n---\n\n${content}`;
}