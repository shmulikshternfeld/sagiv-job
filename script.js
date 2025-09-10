$(document).ready(function() {
    console.log("Document is ready. jQuery is working.");

    const apiUrl = 'https://restcountries.com/v3.1/all';
    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function(data) {
            console.log("Successfully fetched data:", data);
                    },
        error: function(error) {
            console.error("Error fetching data:", error);
            $('#countries-container').html('<p class="text-danger">Failed to load country data.</p>');
        }
    });
});