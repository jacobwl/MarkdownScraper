document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('scrape-form');
    const urlInput = document.getElementById('url-input');
    const markdownOutput = document.getElementById('markdown-output');
    const loading = document.getElementById('loading');
    
    // Initialize status elements after DOM is loaded
    const statusElements = {
        scraping: document.getElementById('status-scraping'),
        extracting: document.getElementById('status-extracting'),
        complete: document.getElementById('status-complete')
    };

    console.log('Status Elements:', statusElements); // Debug line

    function resetStatus() {
        Object.values(statusElements).forEach(element => {
            if (element) {
                element.classList.add('text-secondary');
                element.classList.remove('text-success');
                element.style.opacity = '0.7'; // Changed from 0 to make them visible by default
            }
        });
    }

    function updateStatus(step) {
        const element = statusElements[step];
        if (element) {
            element.style.opacity = '0.7';
        }
    }

    function completeStatus(step) {
        const element = statusElements[step];
        if (element) {
            element.classList.remove('text-secondary');
            element.classList.add('text-success');
            element.style.opacity = '1';
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const url = urlInput.value;

        // Reset UI elements
        loading.classList.remove('d-none');
        markdownOutput.textContent = '';
        resetStatus();
        
        // Show first status
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
            completeStatus('scraping');
            updateStatus('extracting');
            return response.json();
        })
        .then(data => {
            loading.classList.add('d-none');
            if (data.success) {
                completeStatus('extracting');
                updateStatus('complete');
                completeStatus('complete');
                markdownOutput.textContent = data.markdown;
            } else {
                markdownOutput.textContent = `Error: ${data.error}`;
            }
        })
        .catch(error => {
            loading.classList.add('d-none');
            markdownOutput.textContent = `Error: ${error.message}`;
        });
    });
});
