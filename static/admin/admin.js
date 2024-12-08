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

        try {
            const timestamp = new Date().toISOString();
            const fileName = `content/en/news/${timestamp.split('T')[0]}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
            
            // Create the content in Hugo format
            const hugoContent = `---
title: "${title}"
date: ${timestamp}
draft: false
author: "BitcoinZ Team"
categories: ["Update"]
tags: []
type: "news"
layout: "single"
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
                    message: `Add news: ${title}`
                })
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Content saved successfully!');
                titleInput.value = '';
                quill.setContents([]);
            } else {
                throw new Error(result.error || 'Failed to save content');
            }
            
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Error saving content. Please try again.');
        }
    });
});
