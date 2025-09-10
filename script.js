$(document).ready(function() {
    const countriesContainer = $('#countries-container');
    const apiUrl = 'https://restcountries.com/v3.1/all?fields=name,capital,population,flags,languages,currencies,timezones,maps,cca2';
    let allCountriesData = [];

    const weatherApiKey = '%%WEATHER_API_KEY%%';

    function fetchWeather(capital, container) {
        if (!capital) {
            container.html('<p class="text-white-50">לא צוינה עיר בירה לקבלת תחזית.</p>');
            return;
        }

        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${weatherApiKey}&units=metric&lang=he`;
        container.html('<p class="text-white-50">טוען מידע על מזג האוויר...</p>');

        $.ajax({
            url: weatherApiUrl,
            method: 'GET',
            success: function(weather) {
                const weatherHtml = `
                    <h6>מזג האוויר ב${capital}</h6>
                    <div class="d-flex align-items-center justify-content-center">
                        <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="Weather icon">
                        <span class="display-6 ms-3">${Math.round(weather.main.temp)}°C</span>
                        <span class="ms-3 fs-5">${weather.weather[0].description}</span>
                    </div>
                `;
                container.html(weatherHtml);
            },
            error: function() {
                container.html('<p class="text-warning">לא נמצא מידע על מזג האוויר עבור עיר זו.</p>');
            }
        });
    }

    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function(countries) {
            const filteredCountries = countries.filter(country => country.name.official !== 'State of Palestine');
            allCountriesData = filteredCountries;
            displayCountries(allCountriesData);
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
                    <div class="card country-card" data-country-code="${country.cca2}" style="cursor: pointer;">
                        <img src="${flagUrl}" class="card-img-top country-flag" alt="Flag of ${officialName}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${officialName}</h5>
                            <p class="card-text mb-1"><strong>בירה:</strong> ${capital}</p>
                            <p class="card-text"><strong>אוכלוסייה:</strong> ${population}</p>
                        </div>
                    </div>
                </div>
            `;
            countriesContainer.append(countryCardHtml);
        });
    }

    countriesContainer.on('click', '.country-card', function() {
        const countryCode = $(this).data('country-code');
        const countryData = allCountriesData.find(c => c.cca2 === countryCode);

        if (countryData) {
            const languages = Object.values(countryData.languages).join(', ');
            const currencyKey = Object.keys(countryData.currencies)[0];
            const currency = countryData.currencies[currencyKey];
            const currencyText = `${currency.name} (${currency.symbol})`;

            const modalContent = `
              <img src="${countryData.flags.svg}" alt="Flag of ${countryData.name.official}" class="modal-flag">
              <h4>${countryData.name.official}</h4>
              <p><strong>בירה:</strong> ${countryData.capital ? countryData.capital[0] : 'N/A'}</p>
              <p><strong>שפות:</strong> ${languages}</p>
              <p><strong>מטבע:</strong> ${currencyText}</p>
              <p><strong>אזור זמן:</strong> ${countryData.timezones[0]}</p>
              <a href="${countryData.maps.googleMaps}" target="_blank" class="btn btn-info mt-3">הצג במפה</a>
    
              <hr style="border-top: 1px solid rgba(255, 255, 255, 0.2);">
              <div id="weatherInfo" class="mt-3"></div>
            `;
            
            $('#modalBodyContent').html(modalContent);

            fetchWeather(countryData.capital ? countryData.capital[0] : null, $('#weatherInfo'));

            $('#countryModal').modal('show');
        }
    });

    $('#searchInput').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        $('.country-card').each(function() {
            const countryName = $(this).find('.card-title').text().toLowerCase();
            if (countryName.includes(searchTerm)) {
                $(this).parent().show();
            } else {
                $(this).parent().hide();
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