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

    // Add null checks before accessing style
    function resetStatus() {
        Object.values(statusElements).forEach(element => {
            if (element) {
                element.classList.add('text-secondary');
                element.classList.remove('text-success');
                element.style.display = 'none';
            }
        });
    }

    function completeStatus(step) {
        const element = statusElements[step];
        if (element) {
            element.classList.remove('text-secondary');
            element.classList.add('text-success');
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
        
        // Show first status with null check
        if (statusElements.scraping) {
            statusElements.scraping.style.display = 'block';
        }

        // Create form data
        const formData = new FormData();
        formData.append('url', url);

        // Send POST request
        fetch('/scrape', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (statusElements.scraping) {
                completeStatus('scraping');
            }
            if (statusElements.extracting) {
                statusElements.extracting.style.display = 'block';
            }
            return response.json();
        })
        .then(data => {
            loading.classList.add('d-none');
            if (data.success) {
                if (statusElements.extracting) {
                    completeStatus('extracting');
                }
                if (statusElements.complete) {
                    statusElements.complete.style.display = 'block';
                    completeStatus('complete');
                }
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
