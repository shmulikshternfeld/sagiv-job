$(document).ready(function() {
    
    const countriesContainer = $('#countries-container');
    const apiUrl = 'https://restcountries.com/v3.1/all';
    $.ajax({
        url: apiUrl,
        method: 'GET',
         success: function(countries) {
            displayCountries(countries);
        },
        error: function(error) {
            console.error("Error fetching data:", error);
            countriesContainer.html('<p class="text-danger text-center">Failed to load country data.</p>');
        }
    });
     function displayCountries(countries) {
        countriesContainer.empty(); 

        countries.forEach(country => {
            
            const officialName = country.name.official;
            const capital = country.capital ? country.capital[0] : 'N/A';
            const population = country.population.toLocaleString(); 
            const flagUrl = country.flags.svg;

            const countryCardHtml = `
                <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                    <div class="card country-card">
                        <img src="${flagUrl}" class="card-img-top country-flag" alt="Flag of ${officialName}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${officialName}</h5>
                            <p class="card-text mb-1"><strong>Capital:</strong> ${capital}</p>
                            <p class="card-text"><strong>Population:</strong> ${population}</p>
                        </div>
                    </div>
                </div>
            `;
            
            countriesContainer.append(countryCardHtml);
        });
    }
});