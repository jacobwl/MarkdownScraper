document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('scrape-form');
    const urlInput = document.getElementById('url-input');
    const markdownOutput = document.getElementById('markdown-output');
    const loading = document.getElementById('loading');
    const markdownHeading = document.getElementById('markdown-heading');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const url = urlInput.value;

        // Reset UI elements
        loading.classList.remove('d-none');
        markdownOutput.textContent = '';
        markdownHeading.classList.add('d-none'); // Hide heading on new submission

        // Create form data
        const formData = new FormData();
        formData.append('url', url);

        // Send POST request
        fetch('/scrape', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            loading.classList.add('d-none');
            if (data.success) {
                markdownHeading.classList.remove('d-none');  // Show heading only on success
                markdownOutput.textContent = data.markdown;
            } else {
                markdownHeading.classList.add('d-none');     // Hide heading on error
                markdownOutput.textContent = `Error: ${data.error}`;
            }
        })
        .catch(error => {
            loading.classList.add('d-none');
            markdownHeading.classList.add('d-none');         // Hide heading on error
            markdownOutput.textContent = `Error: ${error.message}`;
        });
    });
});
