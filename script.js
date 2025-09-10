$(document).ready(function() {
    
    const countriesContainer = $('#countries-container');
    const apiUrl = 'https://restcountries.com/v3.1/all?fields=name,capital,population,flags';
    $.ajax({
        url: apiUrl,
        method: 'GET',
         success: function(countries) {
            const filteredCountries = countries.filter(country => country.name.official !== 'State of Palestine');
            displayCountries(filteredCountries);
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
    $('#searchInput').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();

        
        $('.col-xl-3').each(function() {
            const countryName = $(this).find('.card-title').text().toLowerCase();
            
           
            if (countryName.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    const backToTopBtn = $('#backToTopBtn');

   
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 200) {
            backToTopBtn.fadeIn();
        } else {
            backToTopBtn.fadeOut();
        }
    });

    
    backToTopBtn.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });
});