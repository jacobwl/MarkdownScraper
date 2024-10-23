document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('scrape-form');
    const urlInput = document.getElementById('url-input');
    const markdownOutput = document.getElementById('markdown-output');
    const loading = document.getElementById('loading');
    const statusMessages = document.getElementById('status-messages');
    const statusText = document.getElementById('status-text');
    const statusProgress = document.getElementById('status-progress');

    function updateStatus(message, progress) {
        statusMessages.classList.remove('d-none');
        statusText.textContent = message;
        statusProgress.style.width = `${progress}%`;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const url = urlInput.value;

        // Show loading spinner and reset output
        loading.classList.remove('d-none');
        markdownOutput.textContent = '';
        
        // Update initial status
        updateStatus('Fetching webpage...', 20);

        // Create form data
        const formData = new FormData();
        formData.append('url', url);

        // Send POST request
        fetch('/scrape', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            updateStatus('Processing content with GPT...', 60);
            return response.json();
        })
        .then(data => {
            // Hide loading spinner and status
            loading.classList.add('d-none');
            statusMessages.classList.add('d-none');

            if (data.success) {
                markdownOutput.textContent = data.markdown;
                updateStatus('Content extracted successfully!', 100);
                setTimeout(() => statusMessages.classList.add('d-none'), 2000);
            } else {
                markdownOutput.textContent = `Error: ${data.error}`;
                updateStatus('Error occurred during processing', 100);
                statusMessages.classList.remove('alert-info').addClass('alert-danger');
            }
        })
        .catch(error => {
            // Hide loading spinner
            loading.classList.add('d-none');
            markdownOutput.textContent = `Error: ${error.message}`;
            updateStatus('Error occurred during processing', 100);
            statusMessages.classList.remove('alert-info').addClass('alert-danger');
        });
    });
});
