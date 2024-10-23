document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('scrape-form');
    const urlInput = document.getElementById('url-input');
    const markdownOutput = document.getElementById('markdown-output');
    const loading = document.getElementById('loading');
    const statusMessages = document.getElementById('statusMessages');

    function addStatusMessage(message) {
        if (!statusMessages) return;

        const timestamp = new Date().toLocaleTimeString();
        const messageElement = document.createElement('div');
        messageElement.className = 'list-group-item bg-dark border-info';
        messageElement.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                    <p class="mb-0">${message}</p>
                    <small class="text-muted">(${timestamp})</small>
                </div>
            </div>
        `;
        
        statusMessages.querySelector('.list-group').appendChild(messageElement);
        statusMessages.classList.remove('d-none');
        messageElement.scrollIntoView({ behavior: 'smooth' });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const url = urlInput.value;

        // Reset and show UI elements
        loading.classList.remove('d-none');
        markdownOutput.textContent = '';
        if (statusMessages) {
            statusMessages.querySelector('.list-group').innerHTML = '';
            statusMessages.classList.remove('d-none');
        }

        // Initial status message
        addStatusMessage('Scraping URL...');

        // Create form data
        const formData = new FormData();
        formData.append('url', url);

        // Send POST request
        fetch('/scrape', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            addStatusMessage('Extracting article contents...');
            return response.json();
        })
        .then(data => {
            // Hide loading spinner
            loading.classList.add('d-none');

            if (data.success) {
                addStatusMessage('Article extracted!');
                markdownOutput.textContent = data.markdown;
            } else {
                addStatusMessage('Error: ' + data.error);
                markdownOutput.textContent = `Error: ${data.error}`;
            }
        })
        .catch(error => {
            // Hide loading spinner
            loading.classList.add('d-none');
            addStatusMessage('Error: ' + error.message);
            markdownOutput.textContent = `Error: ${error.message}`;
        });
    });
});
