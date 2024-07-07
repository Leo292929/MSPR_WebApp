document.addEventListener('DOMContentLoaded', function() {
    const fetchDataButton = document.getElementById('fetchDataButton');
    const dataDiv = document.getElementById('data');

    fetchDataButton.addEventListener('click', function() {
        fetch('/api/espece/all')
            .then(response => response.json())
            .then(data => {
                // Clear any existing content in the data div
                dataDiv.innerHTML = '';

                // Create a preformatted text element to display the JSON data
                const pre = document.createElement('pre');
                pre.textContent = JSON.stringify(data, null, 2); // Format JSON with 2-space indentation
                dataDiv.appendChild(pre);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });
});