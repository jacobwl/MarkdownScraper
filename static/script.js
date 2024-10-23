document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const elements = {
        form: document.getElementById('scrape-form'),
        urlInput: document.getElementById('url-input'),
        markdownOutput: document.getElementById('markdown-output'),
        loading: document.getElementById('loading'),
        statusMessages: document.getElementById('status-messages'),
        statusText: document.getElementById('status-text'),
        statusProgress: document.getElementById('status-progress')
    };

    // Verify all elements exist
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Element ${key} not found in the DOM`);
            return;
        }
    }

    function updateStatus(message, progress) {
        if (elements.statusMessages && elements.statusText && elements.statusProgress) {
            elements.statusMessages.classList.remove('d-none');
            elements.statusText.textContent = message;
            elements.statusProgress.style.width = `${progress}%`;
        }
    }

    function hideStatus() {
        if (elements.statusMessages) {
            elements.statusMessages.classList.add('d-none');
        }
    }

    elements.form.addEventListener('submit', function(e) {
        e.preventDefault();
        const url = elements.urlInput.value;

        // Show loading spinner and reset output
        elements.loading.classList.remove('d-none');
        elements.markdownOutput.textContent = '';
        
        // Initial status - Scraping URL
        updateStatus('Scraping URL...', 20);

        // Create form data
        const formData = new FormData();
        formData.append('url', url);

        // Send POST request
        fetch('/scrape', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            // Update status - Processing with OpenAI
            updateStatus('Extracting article contents...', 60);
            return response.json();
        })
        .then(data => {
            // Hide loading spinner
            elements.loading.classList.add('d-none');

            if (data.success) {
                elements.markdownOutput.textContent = data.markdown;
                // Final status - Article extracted
                updateStatus('Article extracted!', 100);
                setTimeout(hideStatus, 2000);
            } else {
                elements.markdownOutput.textContent = `Error: ${data.error}`;
                updateStatus('Error occurred during processing', 100);
                elements.statusMessages.classList.remove('alert-info');
                elements.statusMessages.classList.add('alert-danger');
            }
        })
        .catch(error => {
            // Hide loading spinner
            elements.loading.classList.add('d-none');
            elements.markdownOutput.textContent = `Error: ${error.message}`;
            updateStatus('Error occurred during processing', 100);
            elements.statusMessages.classList.remove('alert-info');
            elements.statusMessages.classList.add('alert-danger');
        });
    });
});
