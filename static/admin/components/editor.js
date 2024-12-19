export function createEditor(elementId) {
    return new Quill(elementId, {
        theme: 'snow',
        placeholder: 'Enter content here...',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });
}

export function setupEditorEvents(editor) {
    // Progress bar for roadmap
    const progressBar = document.getElementById('roadmap-progress');
    const progressValue = document.getElementById('progress-value');
    if (progressBar && progressValue) {
        progressBar.addEventListener('input', function() {
            progressValue.textContent = this.value + '%';
        });
    }

    // Status change for roadmap
    const statusSelect = document.getElementById('roadmap-status');
    if (statusSelect) {
        statusSelect.addEventListener('change', function() {
            const status = this.value;
            if (progressBar && progressValue) {
                if (status === 'completed') {
                    progressBar.value = 100;
                    progressValue.textContent = '100%';
                } else if (status === 'planned') {
                    progressBar.value = 0;
                    progressValue.textContent = '0%';
                }
            }
        });
    }

    // Preview button
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            const content = editor.root.innerHTML;
            const preview = document.getElementById('preview');
            if (preview) {
                preview.innerHTML = marked.parse(content);
            }
        });
    }
}