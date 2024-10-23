document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('scrape-form');
    const urlInput = document.getElementById('url-input');
    const markdownOutput = document.getElementById('markdown-output');
    const loading = document.getElementById('loading');
    const statusElements = {
        scraping: document.getElementById('status-scraping'),
        extracting: document.getElementById('status-extracting'),
        complete: document.getElementById('status-complete')
    };

    function resetStatus() {
        Object.values(statusElements).forEach(element => {
            if (element) {
                element.classList.add('text-secondary');
                element.classList.remove('text-success');
                element.style.display = 'none';
            }
        });
    }

    function updateStatus(step) {
        const element = statusElements[step];
        if (element) {
            element.style.display = 'block';
        }
    }

    // Initialize by hiding all status messages
    resetStatus();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const url = urlInput.value;

        // Reset UI elements
        loading.classList.remove('d-none');
        markdownOutput.textContent = '';
        resetStatus();
        updateStatus('scraping');

        // Create form data
        const formData = new FormData();
        formData.append('url', url);

        // Send POST request
        fetch('/scrape', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            updateStatus('extracting');
            return response.json();
        })
        .then(data => {
            // Hide loading spinner
            loading.classList.add('d-none');

            if (data.success) {
                updateStatus('complete');
                markdownOutput.textContent = data.markdown;
            } else {
                markdownOutput.textContent = `Error: ${data.error}`;
            }
        })
        .catch(error => {
            // Hide loading spinner
            loading.classList.add('d-none');
            markdownOutput.textContent = `Error: ${error.message}`;
        });
    });
});
